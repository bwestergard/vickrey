/* @flow */

import {
  type Result,
  Ok,
} from 'minimal-result'

import {
  exErr,
  type ExtractionError
} from 'strong-extractors'

// TODO: use $Keys

// Generated from https://github.com/xsolla/currency-format
export type Currency =
'AED' |
'AFN' |
'ALL' |
'AMD' |
'ANG' |
'AOA' |
'ARS' |
'AUD' |
'AWG' |
'AZN' |
'BAM' |
'BBD' |
'BDT' |
'BGN' |
'BHD' |
'BIF' |
'BMD' |
'BND' |
'BOB' |
'BOV' |
'BRL' |
'BSD' |
'BTN' |
'BWP' |
'BYN' |
'BYR' |
'BZD' |
'CAD' |
'CDF' |
'CHE' |
'CHF' |
'CHW' |
'CLF' |
'CLP' |
'CNY' |
'COP' |
'COU' |
'CRC' |
'CUC' |
'CUP' |
'CVE' |
'CZK' |
'DJF' |
'DKK' |
'DOP' |
'DZD' |
'EEK' |
'EGP' |
'ERN' |
'ETB' |
'EUR' |
'FJD' |
'FKP' |
'GBP' |
'GEL' |
'GGP' |
'GHC' |
'GHS' |
'GIP' |
'GMD' |
'GNF' |
'GTQ' |
'GYD' |
'HKD' |
'HNL' |
'HRK' |
'HTG' |
'HUF' |
'IDR' |
'ILS' |
'IMP' |
'INR' |
'IQD' |
'IRR' |
'ISK' |
'JEP' |
'JMD' |
'JOD' |
'JPY' |
'KES' |
'KGS' |
'KHR' |
'KMF' |
'KPW' |
'KRW' |
'KWD' |
'KYD' |
'KZT' |
'LAK' |
'LBP' |
'LKR' |
'LRD' |
'LSL' |
'LTL' |
'LVL' |
'LYD' |
'MAD' |
'MDL' |
'MGA' |
'MKD' |
'MMK' |
'MNT' |
'MOP' |
'MRO' |
'MUR' |
'MVR' |
'MWK' |
'MXN' |
'MXV' |
'MYR' |
'MZN' |
'NAD' |
'NGN' |
'NIO' |
'NOK' |
'NPR' |
'NZD' |
'OMR' |
'PAB' |
'PEN' |
'PGK' |
'PHP' |
'PKR' |
'PLN' |
'PYG' |
'QAR' |
'RON' |
'RSD' |
'RUB' |
'RUR' |
'RWF' |
'SAR' |
'SBD' |
'SCR' |
'SDG' |
'SEK' |
'SGD' |
'SHP' |
'SLL' |
'SOS' |
'SRD' |
'SSP' |
'STD' |
'SVC' |
'SYP' |
'SZL' |
'THB' |
'TJS' |
'TMT' |
'TND' |
'TOP' |
'TRL' |
'TRY' |
'TTD' |
'TWD' |
'TZS' |
'UAH' |
'UGX' |
'USD' |
'USN' |
'UYI' |
'UYU' |
'UZS' |
'VEF' |
'VND' |
'VUV' |
'WST' |
'XAF' |
'XCD' |
'XDR' |
'XOF' |
'XPF' |
'XSU' |
'XUA' |
'YER' |
'ZAR' |
'ZMW' |
'ZWD' |
'ZWL' |
'BTC' |
'ETH' |
'LTC'

export const extract$Currency = (x: mixed): Result<Currency, ExtractionError> => {
  if (x === 'USD') return Ok(x) // Most common currencies first
  if (x === 'EUR') return Ok(x)
  if (x === 'CNY') return Ok(x)

  if (x === 'AED') return Ok(x) // Everything else
  if (x === 'AFN') return Ok(x)
  if (x === 'ALL') return Ok(x)
  if (x === 'AMD') return Ok(x)
  if (x === 'ANG') return Ok(x)
  if (x === 'AOA') return Ok(x)
  if (x === 'ARS') return Ok(x)
  if (x === 'AUD') return Ok(x)
  if (x === 'AWG') return Ok(x)
  if (x === 'AZN') return Ok(x)
  if (x === 'BAM') return Ok(x)
  if (x === 'BBD') return Ok(x)
  if (x === 'BDT') return Ok(x)
  if (x === 'BGN') return Ok(x)
  if (x === 'BHD') return Ok(x)
  if (x === 'BIF') return Ok(x)
  if (x === 'BMD') return Ok(x)
  if (x === 'BND') return Ok(x)
  if (x === 'BOB') return Ok(x)
  if (x === 'BOV') return Ok(x)
  if (x === 'BRL') return Ok(x)
  if (x === 'BSD') return Ok(x)
  if (x === 'BTN') return Ok(x)
  if (x === 'BWP') return Ok(x)
  if (x === 'BYN') return Ok(x)
  if (x === 'BYR') return Ok(x)
  if (x === 'BZD') return Ok(x)
  if (x === 'CAD') return Ok(x)
  if (x === 'CDF') return Ok(x)
  if (x === 'CHE') return Ok(x)
  if (x === 'CHF') return Ok(x)
  if (x === 'CHW') return Ok(x)
  if (x === 'CLF') return Ok(x)
  if (x === 'CLP') return Ok(x)
  if (x === 'COP') return Ok(x)
  if (x === 'COU') return Ok(x)
  if (x === 'CRC') return Ok(x)
  if (x === 'CUC') return Ok(x)
  if (x === 'CUP') return Ok(x)
  if (x === 'CVE') return Ok(x)
  if (x === 'CZK') return Ok(x)
  if (x === 'DJF') return Ok(x)
  if (x === 'DKK') return Ok(x)
  if (x === 'DOP') return Ok(x)
  if (x === 'DZD') return Ok(x)
  if (x === 'EEK') return Ok(x)
  if (x === 'EGP') return Ok(x)
  if (x === 'ERN') return Ok(x)
  if (x === 'ETB') return Ok(x)
  if (x === 'FJD') return Ok(x)
  if (x === 'FKP') return Ok(x)
  if (x === 'GBP') return Ok(x)
  if (x === 'GEL') return Ok(x)
  if (x === 'GGP') return Ok(x)
  if (x === 'GHC') return Ok(x)
  if (x === 'GHS') return Ok(x)
  if (x === 'GIP') return Ok(x)
  if (x === 'GMD') return Ok(x)
  if (x === 'GNF') return Ok(x)
  if (x === 'GTQ') return Ok(x)
  if (x === 'GYD') return Ok(x)
  if (x === 'HKD') return Ok(x)
  if (x === 'HNL') return Ok(x)
  if (x === 'HRK') return Ok(x)
  if (x === 'HTG') return Ok(x)
  if (x === 'HUF') return Ok(x)
  if (x === 'IDR') return Ok(x)
  if (x === 'ILS') return Ok(x)
  if (x === 'IMP') return Ok(x)
  if (x === 'INR') return Ok(x)
  if (x === 'IQD') return Ok(x)
  if (x === 'IRR') return Ok(x)
  if (x === 'ISK') return Ok(x)
  if (x === 'JEP') return Ok(x)
  if (x === 'JMD') return Ok(x)
  if (x === 'JOD') return Ok(x)
  if (x === 'JPY') return Ok(x)
  if (x === 'KES') return Ok(x)
  if (x === 'KGS') return Ok(x)
  if (x === 'KHR') return Ok(x)
  if (x === 'KMF') return Ok(x)
  if (x === 'KPW') return Ok(x)
  if (x === 'KRW') return Ok(x)
  if (x === 'KWD') return Ok(x)
  if (x === 'KYD') return Ok(x)
  if (x === 'KZT') return Ok(x)
  if (x === 'LAK') return Ok(x)
  if (x === 'LBP') return Ok(x)
  if (x === 'LKR') return Ok(x)
  if (x === 'LRD') return Ok(x)
  if (x === 'LSL') return Ok(x)
  if (x === 'LTL') return Ok(x)
  if (x === 'LVL') return Ok(x)
  if (x === 'LYD') return Ok(x)
  if (x === 'MAD') return Ok(x)
  if (x === 'MDL') return Ok(x)
  if (x === 'MGA') return Ok(x)
  if (x === 'MKD') return Ok(x)
  if (x === 'MMK') return Ok(x)
  if (x === 'MNT') return Ok(x)
  if (x === 'MOP') return Ok(x)
  if (x === 'MRO') return Ok(x)
  if (x === 'MUR') return Ok(x)
  if (x === 'MVR') return Ok(x)
  if (x === 'MWK') return Ok(x)
  if (x === 'MXN') return Ok(x)
  if (x === 'MXV') return Ok(x)
  if (x === 'MYR') return Ok(x)
  if (x === 'MZN') return Ok(x)
  if (x === 'NAD') return Ok(x)
  if (x === 'NGN') return Ok(x)
  if (x === 'NIO') return Ok(x)
  if (x === 'NOK') return Ok(x)
  if (x === 'NPR') return Ok(x)
  if (x === 'NZD') return Ok(x)
  if (x === 'OMR') return Ok(x)
  if (x === 'PAB') return Ok(x)
  if (x === 'PEN') return Ok(x)
  if (x === 'PGK') return Ok(x)
  if (x === 'PHP') return Ok(x)
  if (x === 'PKR') return Ok(x)
  if (x === 'PLN') return Ok(x)
  if (x === 'PYG') return Ok(x)
  if (x === 'QAR') return Ok(x)
  if (x === 'RON') return Ok(x)
  if (x === 'RSD') return Ok(x)
  if (x === 'RUB') return Ok(x)
  if (x === 'RUR') return Ok(x)
  if (x === 'RWF') return Ok(x)
  if (x === 'SAR') return Ok(x)
  if (x === 'SBD') return Ok(x)
  if (x === 'SCR') return Ok(x)
  if (x === 'SDG') return Ok(x)
  if (x === 'SEK') return Ok(x)
  if (x === 'SGD') return Ok(x)
  if (x === 'SHP') return Ok(x)
  if (x === 'SLL') return Ok(x)
  if (x === 'SOS') return Ok(x)
  if (x === 'SRD') return Ok(x)
  if (x === 'SSP') return Ok(x)
  if (x === 'STD') return Ok(x)
  if (x === 'SVC') return Ok(x)
  if (x === 'SYP') return Ok(x)
  if (x === 'SZL') return Ok(x)
  if (x === 'THB') return Ok(x)
  if (x === 'TJS') return Ok(x)
  if (x === 'TMT') return Ok(x)
  if (x === 'TND') return Ok(x)
  if (x === 'TOP') return Ok(x)
  if (x === 'TRL') return Ok(x)
  if (x === 'TRY') return Ok(x)
  if (x === 'TTD') return Ok(x)
  if (x === 'TWD') return Ok(x)
  if (x === 'TZS') return Ok(x)
  if (x === 'UAH') return Ok(x)
  if (x === 'UGX') return Ok(x)
  if (x === 'USN') return Ok(x)
  if (x === 'UYI') return Ok(x)
  if (x === 'UYU') return Ok(x)
  if (x === 'UZS') return Ok(x)
  if (x === 'VEF') return Ok(x)
  if (x === 'VND') return Ok(x)
  if (x === 'VUV') return Ok(x)
  if (x === 'WST') return Ok(x)
  if (x === 'XAF') return Ok(x)
  if (x === 'XCD') return Ok(x)
  if (x === 'XDR') return Ok(x)
  if (x === 'XOF') return Ok(x)
  if (x === 'XPF') return Ok(x)
  if (x === 'XSU') return Ok(x)
  if (x === 'XUA') return Ok(x)
  if (x === 'YER') return Ok(x)
  if (x === 'ZAR') return Ok(x)
  if (x === 'ZMW') return Ok(x)
  if (x === 'ZWD') return Ok(x)
  if (x === 'ZWL') return Ok(x)
  if (x === 'BTC') return Ok(x)
  if (x === 'ETH') return Ok(x)
  if (x === 'LTC') return Ok(x)

  return exErr(`Expected ISO 4217 currency code.`)
}
