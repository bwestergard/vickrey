/* @flow */

// Subset of ISO4217
// https://github.com/xsolla/currency-format/blob/master/currency-format.json
type Currency = string // Example: 'USD'
type SeatID = string
type ZeroOrOne = 0 | 1
type Url = string
type Integer = number
type Float = number

// https://www.iab.com/wp-content/uploads/2016/11/OpenRTB-API-Specification-Version-2-5-DRAFT_2016-11.pdf
type LossReasonCode =
| 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10
| 100 | 101 | 102 | 103 | 104
| 200 | 201 | 202 | 203 | 204 | 205 | 206 | 207 | 208 | 209 | 210 | 211 | 212

type OpenrtbCommon<OpenrtbCommonExt,ResponseExt,RequestExt,SourceExt,OfferExt,ItemExt,SeatbidExt,BidExt,Domain> = {|
  ver: string,
  domainspec?: string,
  domainver?: string,
  request?: Request<RequestExt,SourceExt,OfferExt,ItemExt,Domain>,
  response?: Response<ResponseExt,Domain,SeatbidExt,BidExt>,
  ext: OpenrtbCommonExt
|}

type Request<RequestExt,SourceExt,OfferExt,ItemExt,Domain> = {|
  id: string,
  test?: ZeroOrOne, // 0 = live mode; 1 = test mode; default = 0
  tmax?: Integer,
  at?: ZeroOrOne, // Values above 500 are admitted by the specification, to be used for custom auction logics
  curs?: Currency[],
  wcurs?: ZeroOrOne, // Function of currency list. 0 = white list; 1 = black list. Obfuscated disjoint union.
  seats?: SeatID[],
  wseats?: ZeroOrOne, // Obfuscated disjoint union
  source?: Source<SourceExt>,
  offer: Offer<OfferExt,ItemExt>,
  domain?: Domain,
  ext?: RequestExt
|}

type Source<SourceExt> = {|
  fd?: ZeroOrOne, // 0 = exchange; 1 = upstream
  tid?: string,
  pchain: string, // Can potentially be parsed according to "TAG Payment ID Protocol."
  ext?: SourceExt
|}

type Offer<OfferExt,ItemExt> = {|
  item: Array<Item<ItemExt>>,
  package: ZeroOrOne,
  dburl: Url,
  ext: OfferExt
|}

type Item<ItemExt,PmpExt,Domain> = {|
  id: string,
  qty?: Integer,
  flr?: Float,
  flrcur?: Currency, // Obfuscated disjoint union
  seq?: Integer,
  pmp?: Pmp<PmpExt>,
  domain: Domain,
  ext?: ItemExt
|}

type Pmp<PmpExt,DealExt> = {|
  private?: ZeroOrOne, // Obfuscated disjoint union
  deal?: Array<Deal<DealExt>>,
  ext?: PmpExt
|}

type Deal<DealExt> = {|
  id: string,
  qty?: Integer,
  flr?: Float,
  flrcur?: Currency, // Obfuscated disjoint union
  at?: 1 | 2 | 3, // Obfuscated disjoint union, meaning depends on flr
  seat?: string[],
  wadomain: string[],
  ext?: DealExt
|}

type Response<ResponseExt,Domain,SeatbidExt,BidExt> = {|
  id: string,
  bidid?: string,
  nbr?: LossReasonCode,
  cur?: Currency,
  cdata?: string,
  seatbid?: Array<Seatbid<SeatbidExt,Domain,BidExt>>,
  ext?: ResponseExt
|}

type Seatbid<SeatbidExt,Domain,BidExt> = {|
  seat?: string,
  package?: ZeroOrOne,
  bid: Array<Bid<Domain,BidExt>>,
  ext?: SeatbidExt
|}

type Bid<BidExt,Domain> = {|
  id?: string,
  item: string,
  deal?: string,
  price: Float,
  cid?: string,
  tactic?: string,
  burl?: Url,
  lurl?: Url,
  domain: Domain,
  ext?: BidExt
|}
