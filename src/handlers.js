/* @flow */

import {
  type Result,
  Ok,
  mapOk,
  andThen
} from 'minimal-result'

import {
  extractString,
  extractNumber,
  extractBoolean,
  extractMixedArray,
  extractMixedObject,
  extractArrayOf,
  extractDictionaryOf,
  extractNullableOf,
  extractFromKey,
  exErr,
  type ExtractionError,
  type JSONPointer
} from 'strong-extractors'

/* @flow */

// Subset of ISO4217
// https://github.com/xsolla/currency-format/blob/master/currency-format.json
type Currency = 'USD' // Example: 'USD'
type SeatID = string
type ZeroOrOne = 0 | 1
type Url = string
type Integer = number
type Float = number

// https://www.iab.com/wp-content/uploads/2016/11/OpenRTB-API-Specification-Version-2-5-DRAFT_2016-11.pdf
type LossReasonCode = number

type OpenrtbCommon<OpenrtbCommonExt,ResponseExt,RequestExt,SourceExt,OfferExt,ItemExt,SeatbidExt,BidExt,PmpExt,DealExt,Domain> = $ReadOnly<{| // DONE
  ver: string,
  ext: OpenrtbCommonExt,
  domainspec?: string,
  domainver?: string,
  request?: Request<RequestExt,SourceExt,OfferExt,ItemExt,PmpExt,DealExt,Domain>,
  response?: Response<ResponseExt,SeatbidExt,BidExt,Domain>
|}>

type Request<RequestExt,SourceExt,OfferExt,ItemExt,PmpExt,DealExt,Domain> = $ReadOnly<{| // DONE
  id: string,
  offer: Offer<OfferExt,ItemExt,PmpExt,DealExt,Domain>,
  test?: ZeroOrOne, // 0 = live mode; 1 = test mode; default = 0
  tmax?: Integer,
  at?: Integer, // Zero or one have special meanings. Values above 500 are admitted by the specification, to be used for custom auction logics
  curs?: Currency[],
  wcurs?: ZeroOrOne, // Function of currency list. 0 = white list; 1 = black list. Obfuscated disjoint union.
  seats?: SeatID[],
  wseats?: ZeroOrOne, // Obfuscated disjoint union
  source?: Source<SourceExt>,
  domain?: Domain,
  ext?: RequestExt
|}>

type Source<SourceExt> = $ReadOnly<{| // DONE
  pchain: string, // Can potentially be parsed according to "TAG Payment ID Protocol."
  fd?: ZeroOrOne, // 0 = exchange; 1 = upstream
  tid?: string,
  ext?: SourceExt
|}>

type Offer<OfferExt,ItemExt,PmpExt,DealExt,Domain> = $ReadOnly<{| // DONE
  item: Array<Item<ItemExt,PmpExt,DealExt,Domain>>,
  package?: ZeroOrOne,
  dburl?: Url,
  ext?: OfferExt
|}>

type Item<ItemExt,PmpExt,DealExt,Domain> = $ReadOnly<{| // DONE
  id: string,
  domain: Domain,
  qty?: Integer,
  flr?: Float,
  flrcur?: Currency, // Obfuscated disjoint union
  seq?: Integer,
  pmp?: Pmp<PmpExt,DealExt>,
  ext?: ItemExt
|}>

type Pmp<PmpExt,DealExt> = $ReadOnly<{| // DONE
  private?: ZeroOrOne, // Obfuscated disjoint union
  deal?: Array<Deal<DealExt>>,
  ext?: PmpExt
|}>

type Deal<DealExt> = $ReadOnly<{| // DONE
  id: string,
  wadomain: string[],
  qty?: Integer,
  flr?: Float,
  flrcur?: Currency, // Obfuscated disjoint union
  at?: 1 | 2 | 3, // Obfuscated disjoint union, meaning depends on flr
  seat?: string[],
  ext?: DealExt
|}>

type Response<ResponseExt,SeatbidExt,BidExt,Domain> = $ReadOnly<{| // DONE
  id: string,
  bidid?: string,
  nbr?: LossReasonCode,
  cur?: Currency,
  cdata?: string,
  seatbid?: Array<Seatbid<SeatbidExt,BidExt,Domain>>,
  ext?: ResponseExt
|}>

type Seatbid<SeatbidExt,BidExt,Domain> = $ReadOnly<{|
  +bid: Array<Bid<BidExt,Domain>>,
  +seat?: string,
  +package?: ZeroOrOne,
  +ext?: SeatbidExt
|}>

type Bid<BidExt,Domain> = $ReadOnly<{|
  item: string,
  domain: Domain,
  price: Float,
  id?: string,
  deal?: string,
  cid?: string,
  tactic?: string,
  burl?: Url,
  lurl?: Url,
  ext?: BidExt
|}>

const extract$ZeroOrOne = (x: mixed): Result<0 | 1, ExtractionError> =>
(x === 0 || x === 1) ? Ok(x) : exErr(`Expected 0 or 1, received ${JSON.stringify(x)}`)

const usCurrencyCode: Currency = 'USD'
const extract$Currency = (x: mixed): Result<Currency, ExtractionError> =>
(x === usCurrencyCode)
  ? Ok(usCurrencyCode)
  : exErr(`Expected "USD" as currency. Received ${JSON.stringify(x)}`)

const extract$Openrtbcommon = <
  OpenrtbCommonExt,
  ResponseExt,
  RequestExt,
  SourceExt,
  OfferExt,
  ItemExt,
  SeatbidExt,
  BidExt,
  PmpExt,
  DealExt,
  Domain
>(
  exOpenrtbCommonExt: (x: mixed) => Result<OpenrtbCommonExt,ExtractionError>,
  exResponseExt: (x: mixed) => Result<ResponseExt,ExtractionError>,
  exRequestExt: (x: mixed) => Result<RequestExt,ExtractionError>,
  exSourceExt: (x: mixed) => Result<SourceExt,ExtractionError>,
  exOfferExt: (x: mixed) => Result<OfferExt,ExtractionError>,
  exItemExt: (x: mixed) => Result<ItemExt,ExtractionError>,
  exSeatbidExt: (x: mixed) => Result<SeatbidExt,ExtractionError>,
  exBidExt: (x: mixed) => Result<BidExt,ExtractionError>,
  exDealExt: (x: mixed) => Result<DealExt,ExtractionError>,
  exPmpExt: (x: mixed) => Result<PmpExt,ExtractionError>,
  exDomain: (x: mixed) => Result<Domain,ExtractionError>
) => (x: mixed): Result<
  OpenrtbCommon<OpenrtbCommonExt,ResponseExt,RequestExt,SourceExt,OfferExt,ItemExt,SeatbidExt,BidExt,PmpExt,DealExt,Domain>,
  ExtractionError
> =>
andThen(
  extractMixedObject(x),
  (obj) => {
    const reqField0 = extractFromKey(
      extractString,
      'ver',
      obj
    )
    if (reqField0.tag === 'Err') return reqField0

    const reqField1 = extractFromKey(
      exOpenrtbCommonExt,
      'ext',
      obj
    )
    if (reqField1.tag === 'Err') return reqField1

    let rec = {
      ver: reqField0.data,
      ext: reqField1.data
    }

    if (obj.hasOwnProperty('domainspec')) {
      const optField = extractFromKey(
        extractString,
        'domainspec',
        obj
      )
      if (optField.tag === 'Ok') {
        rec = {...rec, 'domainspec': optField.data}
      } else {
        return optField
      }
    }

    if (obj.hasOwnProperty('domainver')) {
      const optField = extractFromKey(
        extractString,
        'domainver',
        obj
      )
      if (optField.tag === 'Ok') {
        rec = {...rec, 'domainver': optField.data}
      } else {
        return optField
      }
    }

    if (obj.hasOwnProperty('request')) {
      const optField = extractFromKey(
        extract$Request(exRequestExt, exSourceExt, exOfferExt, exItemExt, exPmpExt, exDealExt, exDomain),
        'request',
        obj
      )
      if (optField.tag === 'Ok') {
        rec = {...rec, 'request': optField.data}
      } else {
        return optField
      }
    }

    if (obj.hasOwnProperty('response')) {
      const optField = extractFromKey(
        extract$Response(exResponseExt, exSeatbidExt, exBidExt, exDomain),
        'response',
        obj
      )
      if (optField.tag === 'Ok') {
        rec = {...rec, 'response': optField.data}
      } else {
        return optField
      }
    }
    return Ok(rec)
  }
)

const extract$Request =
<RequestExt,SourceExt,OfferExt,ItemExt,PmpExt,DealExt,Domain>(
  exRequestExt: (x: mixed) => Result<RequestExt,ExtractionError>,
  exSourceExt: (x: mixed) => Result<SourceExt,ExtractionError>,
  exOfferExt: (x: mixed) => Result<OfferExt,ExtractionError>,
  exItemExt: (x: mixed) => Result<ItemExt,ExtractionError>,
  exPmpExt: (x: mixed) => Result<PmpExt,ExtractionError>,
  exDealExt: (x: mixed) => Result<DealExt,ExtractionError>,
  exDomain: (x: mixed) => Result<Domain,ExtractionError>
) =>
(x: mixed): Result<Request<RequestExt,SourceExt,OfferExt,ItemExt,PmpExt,DealExt,Domain>,ExtractionError> =>
andThen(
  extractMixedObject(x),
  (obj) => {
    const reqField0 = extractFromKey(
      extractString,
      'id',
      obj
    )
    if (reqField0.tag === 'Err') return reqField0

    const reqField1 = extractFromKey(
      extract$Offer(exOfferExt, exItemExt, exPmpExt, exDealExt, exDomain),
      'offer',
      obj
    )
    if (reqField1.tag === 'Err') return reqField1

    let rec = {
      id: reqField0.data,
      offer: reqField1.data
    }

    // test?: ZeroOrOne, // 0 = live mode; 1 = test mode; default = 0
    if (obj.hasOwnProperty('test')) {
      const optField = extractFromKey(
        extract$ZeroOrOne,
        'test',
        obj
      )
      if (optField.tag === 'Ok') {
        rec = {...rec, 'test': optField.data}
      } else {
        return optField
      }
    }
    // tmax?: Integer,
    if (obj.hasOwnProperty('tmax')) {
      const optField = extractFromKey(
        extractNumber,
        'tmax',
        obj
      )
      if (optField.tag === 'Ok') {
        rec = {...rec, 'tmax': optField.data}
      } else {
        return optField
      }
    }
    // at?: Integer, // Zero or one have special meanings. Values above 500 are admitted by the specification, to be used for custom auction logics
    if (obj.hasOwnProperty('at')) {
      const optField = extractFromKey(
        extract$ZeroOrOne,
        'at',
        obj
      )
      if (optField.tag === 'Ok') {
        rec = {...rec, 'at': optField.data}
      } else {
        return optField
      }
    }
    // curs?: Currency[],
    if (obj.hasOwnProperty('curs')) {
      const optField = extractFromKey(
        (x) => extractArrayOf(extract$Currency, x),
        'curs',
        obj
      )
      if (optField.tag === 'Ok') {
        rec = {...rec, 'curs': optField.data}
      } else {
        return optField
      }
    }
    // wcurs?: ZeroOrOne, // Function of currency list. 0 = white list; 1 = black list. Obfuscated disjoint union.
    if (obj.hasOwnProperty('wcurs')) {
      const optField = extractFromKey(
        extract$ZeroOrOne,
        'wcurs',
        obj
      )
      if (optField.tag === 'Ok') {
        rec = {...rec, 'wcurs': optField.data}
      } else {
        return optField
      }
    }
    // seats?: SeatID[],
    if (obj.hasOwnProperty('seats')) {
      const optField = extractFromKey(
        (x) => extractArrayOf(extractString, x),
        'seats',
        obj
      )
      if (optField.tag === 'Ok') {
        rec = {...rec, 'seats': optField.data}
      } else {
        return optField
      }
    }
    // wseats?: ZeroOrOne, // Obfuscated disjoint union
    if (obj.hasOwnProperty('wseats')) {
      const optField = extractFromKey(
        extract$ZeroOrOne,
        'wseats',
        obj
      )
      if (optField.tag === 'Ok') {
        rec = {...rec, 'wseats': optField.data}
      } else {
        return optField
      }
    }
    // source?: Source<SourceExt>,
    if (obj.hasOwnProperty('source')) {
      const optField = extractFromKey(
        extract$Source(exSourceExt),
        'source',
        obj
      )
      if (optField.tag === 'Ok') {
        rec = {...rec, 'source': optField.data}
      } else {
        return optField
      }
    }
    // domain?: Domain,
    if (obj.hasOwnProperty('domain')) {
      const optField = extractFromKey(
        exDomain,
        'domain',
        obj
      )
      if (optField.tag === 'Ok') {
        rec = {...rec, 'domain': optField.data}
      } else {
        return optField
      }
    }

    // ext?: RequestExt
    if (obj.hasOwnProperty('ext')) {
      const optField = extractFromKey(
        exRequestExt,
        'ext',
        obj
      )
      if (optField.tag === 'Ok') {
        rec = {...rec, 'ext': optField.data}
      } else {
        return optField
      }
    }

    return Ok(rec)
  }
)

const extract$Offer =
<OfferExt,ItemExt,PmpExt,DealExt,Domain>(
  exOfferExt: (x: mixed) => Result<OfferExt,ExtractionError>,
  exItemExt: (x: mixed) => Result<ItemExt,ExtractionError>,
  exPmpExt: (x: mixed) => Result<PmpExt,ExtractionError>,
  exDealExt: (x: mixed) => Result<DealExt,ExtractionError>,
  exDomain: (x: mixed) => Result<Domain,ExtractionError>
) =>
(x: mixed): Result<Offer<OfferExt,ItemExt,PmpExt,DealExt,Domain>,ExtractionError> =>
andThen(
  extractMixedObject(x),
  (obj) => {
    //   item: Array<Item<ItemExt>>,
    const reqField0 = extractFromKey(
      (x) => extractArrayOf(extract$Item(exItemExt, exPmpExt, exDealExt, exDomain), x),
      'item',
      obj
    )
    if (reqField0.tag === 'Err') return reqField0

    let rec = {
      item: reqField0.data,
    }

    if (obj.hasOwnProperty('package')) {
      const optField = extractFromKey(
        extract$ZeroOrOne,
        'package',
        obj
      )
      if (optField.tag === 'Ok') {
        rec = {...rec, 'package': optField.data}
      } else {
        return optField
      }
    }

    if (obj.hasOwnProperty('dburl')) {
      const optField = extractFromKey(
        extractString,
        'dburl',
        obj
      )
      if (optField.tag === 'Ok') {
        rec = {...rec, 'dburl': optField.data}
      } else {
        return optField
      }
    }

    if (obj.hasOwnProperty('ext')) {
      const optField = extractFromKey(
        exOfferExt,
        'ext',
        obj
      )
      if (optField.tag === 'Ok') {
        rec = {...rec, 'ext': optField.data}
      } else {
        return optField
      }
    }

    return Ok(rec)
  }
)

// type Source<SourceExt> = {|
//   pchain: string, // Can potentially be parsed according to "TAG Payment ID Protocol."
//   fd?: ZeroOrOne, // 0 = exchange; 1 = upstream
//   tid?: string,
//   ext?: SourceExt
// |}

const extract$Source =
<SourceExt>(
  exSourceExt: (x: mixed) => Result<SourceExt,ExtractionError>
) => (x: mixed): Result<Source<SourceExt>,ExtractionError> =>
andThen(
  extractMixedObject(x),
  (obj) => {
    //   pchain: string, // Can potentially be parsed according to "TAG Payment ID Protocol."
    const reqField0 = extractFromKey(
      extractString,
      'pchain',
      obj
    )
    if (reqField0.tag === 'Err') return reqField0

    let rec = {
      pchain: reqField0.data,
    }

    //   fd?: ZeroOrOne, // 0 = exchange; 1 = upstream
    if (obj.hasOwnProperty('fd')) {
      const optField = extractFromKey(
        extract$ZeroOrOne,
        'fd',
        obj
      )
      if (optField.tag === 'Ok') {
        rec = {...rec, 'fd': optField.data}
      } else {
        return optField
      }
    }

    //   tid?: string,
    if (obj.hasOwnProperty('tid')) {
      const optField = extractFromKey(
        extractString,
        'tid',
        obj
      )
      if (optField.tag === 'Ok') {
        rec = {...rec, 'tid': optField.data}
      } else {
        return optField
      }
    }

    //   ext?: SourceExt
    if (obj.hasOwnProperty('ext')) {
      const optField = extractFromKey(
        exSourceExt,
        'ext',
        obj
      )
      if (optField.tag === 'Ok') {
        rec = {...rec, 'ext': optField.data}
      } else {
        return optField
      }
    }

    return Ok(rec)
  }
)

const extract$Item =
<ItemExt,PmpExt,DealExt,Domain>(
  exItemExt: (x: mixed) => Result<ItemExt,ExtractionError>,
  exPmpExt: (x: mixed) => Result<PmpExt,ExtractionError>,
  exDealExt: (x: mixed) => Result<DealExt,ExtractionError>,
  exDomain: (x: mixed) => Result<Domain,ExtractionError>,
) => (x: mixed): Result<Item<ItemExt,PmpExt,DealExt,Domain>,ExtractionError> =>
andThen(
  extractMixedObject(x),
  (obj) => {
    const reqField0 = extractFromKey(
      extractString,
      'id',
      obj
    )
    if (reqField0.tag === 'Err') return reqField0

    const reqField1 = extractFromKey(
      exDomain,
      'domain',
      obj
    )
    if (reqField1.tag === 'Err') return reqField1

    let rec = {
      id: reqField0.data,
      domain: reqField1.data,
    }

    if (obj.hasOwnProperty('qty')) {
      const optField = extractFromKey(
        extractNumber,
        'qty',
        obj
      )
      if (optField.tag === 'Ok') {
        rec = {...rec, 'qty': optField.data}
      } else {
        return optField
      }
    }

    if (obj.hasOwnProperty('flr')) {
      const optField = extractFromKey(
        extractNumber,
        'flr',
        obj
      )
      if (optField.tag === 'Ok') {
        rec = {...rec, 'flr': optField.data}
      } else {
        return optField
      }
    }

    if (obj.hasOwnProperty('flrcur')) {
      const optField = extractFromKey(
        extract$Currency,
        'flrcur',
        obj
      )
      if (optField.tag === 'Ok') {
        rec = {...rec, 'flrcur': optField.data}
      } else {
        return optField
      }
    }

    if (obj.hasOwnProperty('seq')) {
      const optField = extractFromKey(
        extractNumber,
        'seq',
        obj
      )
      if (optField.tag === 'Ok') {
        rec = {...rec, 'seq': optField.data}
      } else {
        return optField
      }
    }

    if (obj.hasOwnProperty('pmp')) {
      const optField = extractFromKey(
        extract$Pmp(exPmpExt, exDealExt),
        'pmp',
        obj
      )
      if (optField.tag === 'Ok') {
        rec = {...rec, 'pmp': optField.data}
      } else {
        return optField
      }
    }

    if (obj.hasOwnProperty('ext')) {
      const optField = extractFromKey(
        exItemExt,
        'ext',
        obj
      )
      if (optField.tag === 'Ok') {
        rec = {...rec, 'ext': optField.data}
      } else {
        return optField
      }
    }

    return Ok(rec)
  }
)


const extract$Pmp =
<PmpExt,DealExt>(
  exPmpExt: (x: mixed) => Result<PmpExt,ExtractionError>,
  exDealExt: (x: mixed) => Result<DealExt,ExtractionError>
) => (x: mixed): Result<Pmp<PmpExt,DealExt>,ExtractionError> =>
andThen(
  extractMixedObject(x),
  (obj) => {
    let rec = Object.freeze({})

    if (obj.hasOwnProperty('private')) {
      const optField = extractFromKey(
        extract$ZeroOrOne,
        'private',
        obj
      )
      if (optField.tag === 'Ok') {
        rec = {...rec, 'private': optField.data}
      } else {
        return optField
      }
    }

    if (obj.hasOwnProperty('deal')) {
      const optField = extractFromKey(
        (x) => extractArrayOf(extract$Deal(exDealExt), x),
        'deal',
        obj
      )
      if (optField.tag === 'Ok') {
        rec = {...rec, 'deal': optField.data}
      } else {
        return optField
      }
    }

    if (obj.hasOwnProperty('ext')) {
      const optField = extractFromKey(
        exPmpExt,
        'ext',
        obj
      )
      if (optField.tag === 'Ok') {
        rec = {...rec, 'ext': optField.data}
      } else {
        return optField
      }
    }

    return Ok(rec)
  }
)

const extract$Deal =
<DealExt>(
  exDealExt: (x: mixed) => Result<DealExt,ExtractionError>
) => (x: mixed): Result<Deal<DealExt>,ExtractionError> =>
andThen(
  extractMixedObject(x),
  (obj) => {
    const reqField0 = extractFromKey(
      extractString,
      'id',
      obj
    )
    if (reqField0.tag === 'Err') return reqField0

    const reqField1 = extractFromKey(
      (x) => extractArrayOf(extractString, x),
      'wadomain',
      obj
    )
    if (reqField1.tag === 'Err') return reqField1

    let rec = {
      id: reqField0.data,
      wadomain: reqField1.data,
    }

    if (obj.hasOwnProperty('qty')) {
      const optField = extractFromKey(
        extractNumber,
        'qty',
        obj
      )
      if (optField.tag === 'Ok') {
        rec = {...rec, 'qty': optField.data}
      } else {
        return optField
      }
    }

    if (obj.hasOwnProperty('flr')) {
      const optField = extractFromKey(
        extractNumber,
        'flr',
        obj
      )
      if (optField.tag === 'Ok') {
        rec = {...rec, 'flr': optField.data}
      } else {
        return optField
      }
    }

    if (obj.hasOwnProperty('flrcur')) {
      const optField = extractFromKey(
        extract$Currency,
        'flrcur',
        obj
      )
      if (optField.tag === 'Ok') {
        rec = {...rec, 'flrcur': optField.data}
      } else {
        return optField
      }
    }

    if (obj.hasOwnProperty('at')) {
      const optField = extractFromKey(
        (x) => x === 1 || x === 2 || x === 3 ? Ok(x) : exErr(`Expected value to be 1, 2, or 3; received ${JSON.stringify(x)}`),
        'at',
        obj
      )
      if (optField.tag === 'Ok') {
        rec = {...rec, 'at': optField.data}
      } else {
        return optField
      }
    }

    if (obj.hasOwnProperty('seat')) {
      const optField = extractFromKey(
        (x) => extractArrayOf(extractString, x),
        'seat',
        obj
      )
      if (optField.tag === 'Ok') {
        rec = {...rec, 'seat': optField.data}
      } else {
        return optField
      }
    }

    if (obj.hasOwnProperty('ext')) {
      const optField = extractFromKey(
        exDealExt,
        'ext',
        obj
      )
      if (optField.tag === 'Ok') {
        rec = {...rec, 'ext': optField.data}
      } else {
        return optField
      }
    }

    return Ok(rec)
  }
)

const extract$Response =
<ResponseExt,SeatbidExt,BidExt,Domain>(
  exResponseExt: (x: mixed) => Result<ResponseExt,ExtractionError>,
  exSeatbidExt: (x: mixed) => Result<SeatbidExt,ExtractionError>,
  exBidExt: (x: mixed) => Result<BidExt,ExtractionError>,
  exDomain: (x: mixed) => Result<Domain,ExtractionError>
) =>
(x: mixed): Result<Response<ResponseExt,SeatbidExt,BidExt,Domain>,ExtractionError> =>
andThen(
  extractMixedObject(x),
  (obj) => {
    const reqField0 = extractFromKey(
      extractString,
      'id',
      obj
    )
    if (reqField0.tag === 'Err') return reqField0

    let rec = {
      id: reqField0.data
    }

    if (obj.hasOwnProperty('bidid')) {
      const optField = extractFromKey(
        extractString,
        'bidid',
        obj
      )
      if (optField.tag === 'Ok') {
        rec = {...rec, 'bidid': optField.data}
      } else {
        return optField
      }
    }

    if (obj.hasOwnProperty('nbr')) {
      const optField = extractFromKey(
        extractNumber,
        'nbr',
        obj
      )
      if (optField.tag === 'Ok') {
        rec = {...rec, 'nbr': optField.data}
      } else {
        return optField
      }
    }

    if (obj.hasOwnProperty('cur')) {
      const optField = extractFromKey(
        extract$Currency,
        'cur',
        obj
      )
      if (optField.tag === 'Ok') {
        rec = {...rec, 'cur': optField.data}
      } else {
        return optField
      }
    }

    if (obj.hasOwnProperty('cdata')) {
      const optField = extractFromKey(
        extractString,
        'cdata',
        obj
      )
      if (optField.tag === 'Ok') {
        rec = {...rec, 'cdata': optField.data}
      } else {
        return optField
      }
    }

    if (obj.hasOwnProperty('seatbid')) {
      const optField = extractFromKey(
        extract$Seatbid(exSeatbidExt,exBidExt,exDomain),
        'seatbid',
        obj
      )
      if (optField.tag === 'Ok') {
        rec = {...rec, 'seatbid': optField.data}
      } else {
        return optField
      }
    }

    if (obj.hasOwnProperty('ext')) {
      const optField = extractFromKey(
        exResponseExt,
        'ext',
        obj
      )
      if (optField.tag === 'Ok') {
        rec = {...rec, 'ext': optField.data}
      } else {
        return optField
      }
    }

    return Ok(rec)
  }
)

const extract$Seatbid =
<SeatbidExt,BidExt,Domain>(
  exSeatbidExt: (x: mixed) => Result<SeatbidExt,ExtractionError>,
  exBidExt: (x: mixed) => Result<BidExt,ExtractionError>,
  exDomain: (x: mixed) => Result<Domain,ExtractionError>
) => (x: mixed): Result<Seatbid<SeatbidExt,BidExt,Domain>,ExtractionError> =>
andThen(
  extractMixedObject(x),
  (obj) => {
    const reqField0 = extractFromKey(
      (x) => extractArrayOf(extract$Bid(exBidExt, exDomain), x),
      'bid',
      obj
    )
    if (reqField0.tag === 'Err') return reqField0

    let rec = {
      bid: reqField0.data
    }

    if (obj.hasOwnProperty('seat')) {
      const optField = extractFromKey(
        extractString,
        'seat',
        obj
      )
      if (optField.tag === 'Ok') {
        rec = {...rec, 'seat': optField.data}
      } else {
        return optField
      }
    }

    if (obj.hasOwnProperty('package')) {
      const optField = extractFromKey(
        extract$ZeroOrOne,
        'package',
        obj
      )
      if (optField.tag === 'Ok') {
        rec = {...rec, 'package': optField.data}
      } else {
        return optField
      }
    }

    if (obj.hasOwnProperty('ext')) {
      const optField = extractFromKey(
        exSeatbidExt,
        'ext',
        obj
      )
      if (optField.tag === 'Ok') {
        rec = {...rec, 'ext': optField.data}
      } else {
        return optField
      }
    }

    return Ok(rec)
  }
)

const extract$Bid =
<BidExt,Domain>(
  exBidExt: (x: mixed) => Result<BidExt,ExtractionError>,
  exDomain: (x: mixed) => Result<Domain,ExtractionError>
) => (x: mixed): Result<Bid<BidExt,Domain>,ExtractionError> =>
andThen(
  extractMixedObject(x),
  (obj) => {
    const reqField0 = extractFromKey(
      extractString,
      'id',
      obj
    )
    if (reqField0.tag === 'Err') return reqField0

    const reqField1 = extractFromKey(
      exDomain,
      'domain',
      obj
    )
    if (reqField1.tag === 'Err') return reqField1


    const reqField2 = extractFromKey(
      extractNumber,
      'price',
      obj
    )
    if (reqField2.tag === 'Err') return reqField2

    let rec = {
      item: reqField0.data,
      domain: reqField1.data,
      price: reqField2.data
    }

    if (obj.hasOwnProperty('id')) {
      const optField = extractFromKey(
        extractString,
        'id',
        obj
      )
      if (optField.tag === 'Ok') {
        rec = {...rec, 'id': optField.data}
      } else {
        return optField
      }
    }

    if (obj.hasOwnProperty('deal')) {
      const optField = extractFromKey(
        extractString,
        'deal',
        obj
      )
      if (optField.tag === 'Ok') {
        rec = {...rec, 'deal': optField.data}
      } else {
        return optField
      }
    }

    if (obj.hasOwnProperty('cid')) {
      const optField = extractFromKey(
        extractString,
        'cid',
        obj
      )
      if (optField.tag === 'Ok') {
        rec = {...rec, 'cid': optField.data}
      } else {
        return optField
      }
    }

    if (obj.hasOwnProperty('tactic')) {
      const optField = extractFromKey(
        extractString,
        'tactic',
        obj
      )
      if (optField.tag === 'Ok') {
        rec = {...rec, 'tactic': optField.data}
      } else {
        return optField
      }
    }

    if (obj.hasOwnProperty('burl')) {
      const optField = extractFromKey(
        extractString,
        'burl',
        obj
      )
      if (optField.tag === 'Ok') {
        rec = {...rec, 'burl': optField.data}
      } else {
        return optField
      }
    }

    if (obj.hasOwnProperty('lurl')) {
      const optField = extractFromKey(
        extractString,
        'lurl',
        obj
      )
      if (optField.tag === 'Ok') {
        rec = {...rec, 'lurl': optField.data}
      } else {
        return optField
      }
    }

    if (obj.hasOwnProperty('ext')) {
      const optField = extractFromKey(
        exBidExt,
        'ext',
        obj
      )
      if (optField.tag === 'Ok') {
        rec = {...rec, 'ext': optField.data}
      } else {
        return optField
      }
    }

    return Ok(rec)
  }
)
