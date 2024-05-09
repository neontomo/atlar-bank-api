/* Input types */

export type BankStatement = {
  Document: Document
}

export interface Document {
  $: XmlNamespace
  BkToCstmrStmt?: BankToCustomerStatement[] | null
}

export interface XmlNamespace {
  'xmlns': string
  'xmlns:xsi': string
  'xsi:schemaLocation': string
}

export interface BankToCustomerStatement {
  GrpHdr?: GroupHeader[] | null
  Stmt?: Statement[] | null
}

export interface GroupHeader {
  MsgId?: string[] | null
  CreDtTm?: string[] | null
  MsgRcpt?: MessageRecipient[] | null
}

export interface MessageRecipient {
  Id?: Identifier[] | null
}

export interface Identifier {
  OrgId?: OrganizationId[] | null
}

export interface OrganizationId {
  Othr?: Other[] | null
}

export interface Other {
  Id?: string[] | null
  SchmeNm?: SchemeName[] | null
}

export interface SchemeName {
  Cd?: string[] | null
}

export interface Statement {
  Id?: string[] | null
  ElctrncSeqNb?: string[] | null
  LglSeqNb?: string[] | null
  CreDtTm?: string[] | null
  FrToDt?: FromToDate[] | null
  Acct?: Account[] | null
  Bal?: Balance[] | null
  TxsSummry?: TransactionsSummary[] | null
  Ntry?: Entry[] | null
}

export interface FromToDate {
  FrDtTm?: string[] | null
  ToDtTm?: string[] | null
}

export interface Account {
  Id?: OrganizationId[] | null
  Ccy?: string[] | null
  Ownr?: Owner[] | null
  Svcr?: Servicer[] | null
}

export interface Owner {
  Nm?: string[] | null
  Id?: Identifier[] | null
}

export interface Servicer {
  FinInstnId?: FinancialInstitutionId[] | null
}

export interface FinancialInstitutionId {
  BIC?: string[] | null
}

export interface Balance {
  Tp?: Type[] | null
  CdtLine?: CreditLine[] | null
  Amt?: Amount[] | null
  CdtDbtInd?: string[] | null
  Dt?: Date[] | null
}

export interface Type {
  CdOrPrtry?: SchemeName[] | null
}

export interface CreditLine {
  Incl?: string[] | null
  Amt?: Amount[] | null
}

export interface Amount {
  _: string
  $: Currency
}

export interface Currency {
  Ccy: string
}

export interface Date {
  Dt?: string[] | null
}

export interface TransactionsSummary {
  TtlCdtNtries?: TotalCreditEntries[] | null
  TtlDbtNtries?: TotalDebitEntries[] | null
}

export interface TotalCreditEntries {
  NbOfNtries?: string[] | null
  Sum?: string[] | null
}

export interface Entry {
  NtryRef?: string[] | null
  Amt?: Amount[] | null
  CdtDbtInd?: string[] | null
  Sts?: string[] | null
  BookgDt?: Date[] | null
  ValDt?: Date[] | null
  AcctSvcrRef?: string[] | null
  BkTxCd?: BankTransactionCode[] | null
  NtryDtls?: EntryDetails[] | null
}

export interface BankTransactionCode {
  Domn?: Domain[] | null
  Prtry?: Proprietary[] | null
}

export interface Domain {
  Cd?: string[] | null
  Fmly?: Family[] | null
}

export interface Family {
  Cd?: string[] | null
  SubFmlyCd?: string[] | null
}

export interface Proprietary {
  Cd?: string[] | null
  Issr?: string[] | null
}

export interface EntryDetails {
  TxDtls?: TransactionDetails[] | null
}

export interface TransactionDetails {
  Refs?: References[] | null
  AmtDtls?: AmountDetails[] | null
  RltdPties?: RelatedParties[] | null
  RltdAgts?: RelatedAgents[] | null
  RmtInf?: RemittanceInformation[] | null
  Purp?: Purpose[] | null
}

export interface References {
  MsgId?: string[] | null
  AcctSvcrRef?: string[] | null
  PmtInfId?: string[] | null
  InstrId?: string[] | null
  EndToEndId?: string[] | null
}

export interface AmountDetails {
  TxAmt?: TransactionAmount[] | null
  PrtryAmt?: ProprietaryAmount[] | null
}

export interface TransactionAmount {
  Amt?: Amount[] | null
}

export interface ProprietaryAmount {
  Tp?: string[] | null
  Amt?: Amount[] | null
}

export interface RelatedParties {
  Dbtr?: Debtor[] | null
  DbtrAcct?: DebtorAccount[] | null
  Cdtr?: Creditor[] | null
  CdtrAcct?: CreditorAccount[] | null
  UltmtCdtr?: UltimateCreditor[] | null
}

export interface Debtor {
  Nm?: string[] | null
  PstlAdr?: PostalAddress[] | null
  Id?: Identifier[] | null
}

export interface PostalAddress {
  StrtNm?: string[] | null
  PstCd?: string[] | null
  TwnNm?: string[] | null
}

export interface DebtorAccount {
  Id?: Identifier[] | null
  Ccy?: string[] | null
}

export interface Creditor {
  Nm?: string[] | null
  Id?: Identifier[] | null
}

export interface CreditorAccount {
  Id?: Identifier[] | null
}

export interface UltimateCreditor {
  Nm?: string[] | null
}

export interface RelatedAgents {
  DbtrAgt?: DebtorAgent[] | null
  CdtrAgt?: CreditorAgent[] | null
}

export interface DebtorAgent {
  FinInstnId?: FinancialInstitutionId[] | null
}

export interface CreditorAgent {
  FinInstnId?: FinancialInstitutionId[] | null
}

export interface RemittanceInformation {
  Strd?: Structured[] | null
  Ustrd?: string[] | null
}

export interface Structured {
  RfrdDocAmt?: ReferredDocumentAmount[] | null
  CdtrRefInf?: CreditorReferenceInformation[] | null
  RfrdDocInf?: ReferredDocumentInformation[] | null
}

export interface ReferredDocumentAmount {
  RmtdAmt?: Amount[] | null
}

export interface CreditorReferenceInformation {
  Tp?: Type[] | null
  Ref?: string[] | null
}

export interface ReferredDocumentInformation {
  Tp?: Type[] | null
  Nb?: string[] | null
}

/* Output types */

export type AccountNew = {
  accountNumber?: string | null
  currency?: string | null
  ownerName?: string | null
  balance?: Balance | null
}

export type BalanceNew = {
  amount: string | null
  currency: string | null
  date?: string | null
}

export type TransactionNew = {
  accountNumber?: string
  entryReference?: string | null
  amountDetails: {
    amount: string | null
    currency: string | null
  }
  currency?: string | null
  description?: string | null
  bookingDate?: string | null
  remittanceInformation?: {
    referenceInfo?: {
      msgID?: string | null
      accountServicerReference?: string | null
      paymentInformationID?: string | null
      instructionID?: string | null
      endToEndID?: string | null
    }
  }
}

/* Files */

export type validFileTypes = 'json' | 'xml'
