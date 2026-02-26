import { createContext, ReactNode, useContext, useMemo, useState } from 'react';

export type Language = 'en' | 'am' | 'om';

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    'layout.subtitle': 'Hermata Merkato Kebele - Jimma, Ethiopia',

    'page.dashboard': 'Vital Events Registration System',
    'page.birth': 'Birth Registration',
    'page.death': 'Death Registration',
    'page.marriage': 'Marriage Registration',
    'page.divorce': 'Divorce Registration',
    'page.search': 'Search Records',
    'page.certificates': 'View Certificate',

    'dashboard.welcomeTitle': 'Welcome to Vital Events Registration System',
    'dashboard.welcomeBody':
      'Select an option below to register vital events, search records, or print certificates.',
    'dashboard.stats.births': 'Births',
    'dashboard.stats.deaths': 'Deaths',
    'dashboard.stats.marriages': 'Marriages',
    'dashboard.stats.divorces': 'Divorces',

    'dashboard.card.birth.description': 'Register new births and issue birth certificates',
    'dashboard.card.death.description': 'Register deaths and issue death certificates',
    'dashboard.card.marriage.description': 'Register marriages and issue marriage certificates',
    'dashboard.card.divorce.description': 'Register divorces and issue divorce certificates',
    'dashboard.card.search.description': 'Search and view existing vital event records',
    'dashboard.card.certificates.description': 'View and print certificates for issued records',

    'certificate.header.country': 'Federal Democratic Republic of Ethiopia',
    'certificate.header.region': 'Oromia Regional State',
    'certificate.header.office': 'Hermata Merkato Kebele Administration Office',
    'certificate.header.city': 'Jimma, Ethiopia',

    'certificate.birth.title': 'BIRTH CERTIFICATE',
    'certificate.death.title': 'DEATH CERTIFICATE',
    'certificate.marriage.title': 'MARRIAGE CERTIFICATE',
    'certificate.divorce.title': 'DIVORCE CERTIFICATE',

    'certificate.field.registrationNumber': 'Registration Number',
    'certificate.field.childFullName': "Child's Full Name",
    'certificate.field.dateOfBirth': 'Date of Birth',
    'certificate.field.sex': 'Sex',
    'certificate.field.nationality': 'Nationality',
    'certificate.field.motherFullName': "Mother's Full Name",
    'certificate.field.fatherFullName': "Father's Full Name",
    'certificate.field.placeOfBirth': 'Place of Birth',
    'certificate.field.registrationDate': 'Registration Date',

    'certificate.field.fullName': 'Full Name',
    'certificate.field.dateOfDeath': 'Date of Death',
    'certificate.field.causeOfDeath': 'Cause of Death',
    'certificate.field.birthRegNumber': 'Birth Registration Number',
    'certificate.field.lastKnownAddress': 'Last Known Address',

    'certificate.field.husband': 'Husband',
    'certificate.field.wife': 'Wife',
    'certificate.field.age': 'Age',
    'certificate.field.address': 'Address',
    'certificate.field.dateOfMarriage': 'Date of Marriage',
    'certificate.field.dateOfDivorce': 'Date of Divorce',
    'certificate.field.requestedBy': 'Requested By',

    'certificate.footer.issueDate': 'Issue Date',
    'certificate.footer.officialSignature': 'Official Signature',
    'certificate.footer.kebeleAdministrator': 'Kebele Administrator',

    'certificate.actions.print': 'Print Certificate',

    // Forms & search - common
    'common.form.addressSection': 'Address Information',
    'common.form.city': 'City',
    'common.form.kebele': 'Kebele',
    'common.form.houseNumber': 'House Number',

    // Birth registration form
    'birth.form.successTitle': 'Birth Registered Successfully',
    'birth.form.childName': 'Child Full Name',
    'birth.form.dateOfBirth': 'Date of Birth',
    'birth.form.sex': 'Sex',
    'birth.form.nationality': 'Nationality',
    'birth.form.motherName': "Mother Full Name",
    'birth.form.fatherName': "Father Full Name",
    'birth.form.registerButton': 'Register Birth',

    // Death registration form
    'death.form.successTitle': 'Death Registered Successfully',
    'death.form.fullName': 'Full Name',
    'death.form.birthRegNo': 'Birth Registration Number',
    'death.form.optionalHint': 'Optional: if available',
    'death.form.dateOfBirth': 'Date of Birth',
    'death.form.dateOfDeath': 'Date of Death',
    'death.form.sex': 'Sex',
    'death.form.nationality': 'Nationality',
    'death.form.causeOfDeath': 'Cause of Death',
    'death.form.registerButton': 'Register Death',

    // Marriage registration form
    'marriage.form.successTitle': 'Marriage Registered Successfully',
    'marriage.form.husbandSection': 'Husband Information',
    'marriage.form.wifeSection': 'Wife Information',
    'marriage.form.fullName': 'Full Name',
    'marriage.form.age': 'Age',
    'marriage.form.nationality': 'Nationality',
    'marriage.form.dateOfMarriage': 'Date of Marriage',
    'marriage.form.registerButton': 'Register Marriage',

    // Divorce registration form
    'divorce.form.successTitle': 'Divorce Registered Successfully',
    'divorce.form.husbandSection': 'Husband Information',
    'divorce.form.wifeSection': 'Wife Information',
    'divorce.form.fullName': 'Full Name',
    'divorce.form.age': 'Age',
    'divorce.form.nationality': 'Nationality',
    'divorce.form.dateOfDivorce': 'Date of Divorce',
    'divorce.form.requester': 'Requester',
    'divorce.form.requester.husband': 'Husband',
    'divorce.form.requester.wife': 'Wife',
    'divorce.form.requester.both': 'Both',
    'divorce.form.registerButton': 'Register Divorce',

    // Search records
    'search.form.title': 'Search Records',
    'search.form.placeholder': 'Search by name, registration number...',
    'search.form.status': 'Status',
    'search.form.status.all': 'All statuses',
    'search.form.status.pending': 'Pending',
    'search.form.status.approved': 'Approved',
    'search.form.status.rejected': 'Rejected',
    'search.form.recordType': 'Record Type',
    'search.form.recordType.all': 'All Records',
    'search.form.recordType.birth': 'Birth Records',
    'search.form.recordType.death': 'Death Records',
    'search.form.recordType.marriage': 'Marriage Records',
    'search.form.recordType.divorce': 'Divorce Records',

    'search.table.birth.title': 'Birth Records',
    'search.table.death.title': 'Death Records',
    'search.table.marriage.title': 'Marriage Records',
    'search.table.divorce.title': 'Divorce Records',

    'search.table.column.regNo': 'Reg No.',
    'search.table.column.childName': 'Child Name',
    'search.table.column.dateOfBirth': 'Date of Birth',
    'search.table.column.parents': 'Parents',
    'search.table.column.name': 'Name',
    'search.table.column.dateOfDeath': 'Date of Death',
    'search.table.column.cause': 'Cause',
    'search.table.column.husband': 'Husband',
    'search.table.column.wife': 'Wife',
    'search.table.column.date': 'Date',
    'search.table.column.status': 'Status',
    'search.table.column.actions': 'Actions',
    'search.table.action.viewCertificate': 'View Certificate',
  },
  am: {
    'layout.subtitle': 'ሄርማታ መርካቶ ቀበሌ - ጂማ፣ ኢትዮጵያ',

    'page.dashboard': 'የሕይወት ክስተቶች መመዝገቢያ ስርዓት',
    'page.birth': 'የውለድ መመዝገቢያ',
    'page.death': 'የሞት መመዝገቢያ',
    'page.marriage': 'የጋብቻ መመዝገቢያ',
    'page.divorce': 'የፍቺ መመዝገቢያ',
    'page.search': 'መዝገቦች መፈለጊያ',
    'page.certificates': 'ሰርተፍኬቶች መመልከቻ',

    'dashboard.welcomeTitle': 'ወደ የሕይወት ክስተቶች መመዝገቢያ ስርዓት እንኳን ደህና መጡ',
    'dashboard.welcomeBody':
      'ከሚከተሉት አማራጮች በመምረጥ የሕይወት ክስተቶችን ይመዝግቡ፣ መዝገቦችን ይፈልጉ ወይም ሰርተፍኬቶችን ያትሙ።',
    'dashboard.stats.births': 'ውለዶች',
    'dashboard.stats.deaths': 'ሞቶች',
    'dashboard.stats.marriages': 'ጋብቻዎች',
    'dashboard.stats.divorces': 'ፍቺዎች',

    'dashboard.card.birth.description': 'አዲስ የውለድ መዝገቦችን ይመዝግቡ እና ሰርተፍኬቶች ያውጡ',
    'dashboard.card.death.description': 'የሞት መዝገቦችን ይመዝግቡ እና ሰርተፍኬት ያስገኙ',
    'dashboard.card.marriage.description': 'የጋብቻ መዝገቦችን ይመዝግቡ እና ሰርተፍኬት ያውጡ',
    'dashboard.card.divorce.description': 'የፍቺ መዝገቦችን ይመዝግቡ እና ሰርተፍኬት ያውጡ',
    'dashboard.card.search.description': 'ቀድሞ የተመዘገቡ መዝገቦችን ፈልጉ እና ተመልከቱ',
    'dashboard.card.certificates.description': 'የተሰጡ ሰርተፍኬቶችን ይመልከቱ እና ያትሙ',

    'certificate.header.country': 'የኢትዮጵያ ፌዴራል ዴሞክራሲያዊ ሪፐብሊክ',
    'certificate.header.region': 'ኦሮሚያ ክልል መንግሥት',
    'certificate.header.office': 'ሄርማታ መርካቶ ቀበሌ አስተዳደር ጽ/ቤት',
    'certificate.header.city': 'ጂማ፣ ኢትዮጵያ',

    'certificate.birth.title': 'የውለድ ሰርተፍኬት',
    'certificate.death.title': 'የሞት ሰርተፍኬት',
    'certificate.marriage.title': 'የጋብቻ ሰርተፍኬት',
    'certificate.divorce.title': 'የፍቺ ሰርተፍኬት',

    'certificate.field.registrationNumber': 'የመመዝገቢያ ቁጥር',
    'certificate.field.childFullName': 'የልጁ ሙሉ ስም',
    'certificate.field.dateOfBirth': 'የውለድ ቀን',
    'certificate.field.sex': 'ፆታ',
    'certificate.field.nationality': 'ዜግነት',
    'certificate.field.motherFullName': 'የእናት ሙሉ ስም',
    'certificate.field.fatherFullName': 'የአባት ሙሉ ስም',
    'certificate.field.placeOfBirth': 'የውለድ ቦታ',
    'certificate.field.registrationDate': 'የመመዝገቢያ ቀን',

    'certificate.field.fullName': 'ሙሉ ስም',
    'certificate.field.dateOfDeath': 'የሞት ቀን',
    'certificate.field.causeOfDeath': 'የሞት ምክንያት',
    'certificate.field.birthRegNumber': 'የውለድ መመዝገቢያ ቁጥር',
    'certificate.field.lastKnownAddress': 'የመጨረሻ የመኖሪያ አድራሻ',

    'certificate.field.husband': 'ሚስት ባል',
    'certificate.field.wife': 'ሚስት',
    'certificate.field.age': 'እድሜ',
    'certificate.field.address': 'አድራሻ',
    'certificate.field.dateOfMarriage': 'የጋብቻ ቀን',
    'certificate.field.dateOfDivorce': 'የፍቺ ቀን',
    'certificate.field.requestedBy': 'ጥያቄ ያቀረበው',

    'certificate.footer.issueDate': 'የሰጠበት ቀን',
    'certificate.footer.officialSignature': 'የመኮንን ፊርማ',
    'certificate.footer.kebeleAdministrator': 'የቀበሌ አስተዳዳሪ',

    'certificate.actions.print': 'ሰርተፍኬት አትም',

    // Forms & search - common
    'common.form.addressSection': 'የአድራሻ መረጃ',
    'common.form.city': 'ከተማ',
    'common.form.kebele': 'ቀበሌ',
    'common.form.houseNumber': 'የቤት ቁጥር',

    // Birth registration form
    'birth.form.successTitle': 'የውለድ መመዝገብ ተሳክቷል',
    'birth.form.childName': 'የልጁ ሙሉ ስም',
    'birth.form.dateOfBirth': 'የውለድ ቀን',
    'birth.form.sex': 'ፆታ',
    'birth.form.nationality': 'ዜግነት',
    'birth.form.motherName': 'የእናት ሙሉ ስም',
    'birth.form.fatherName': 'የአባት ሙሉ ስም',
    'birth.form.registerButton': 'ውለድ መዝግብ',

    // Death registration form
    'death.form.successTitle': 'የሞት መመዝገብ ተሳክቷል',
    'death.form.fullName': 'ሙሉ ስም',
    'death.form.birthRegNo': 'የውለድ መመዝገቢያ ቁጥር',
    'death.form.optionalHint': '፡ አማራጭ፣ ካለ',
    'death.form.dateOfBirth': 'የውለድ ቀን',
    'death.form.dateOfDeath': 'የሞት ቀን',
    'death.form.sex': 'ፆታ',
    'death.form.nationality': 'ዜግነት',
    'death.form.causeOfDeath': 'የሞት ምክንያት',
    'death.form.registerButton': 'ሞት መዝግብ',

    // Marriage registration form
    'marriage.form.successTitle': 'የጋብቻ መመዝገብ ተሳክቷል',
    'marriage.form.husbandSection': 'የባል መረጃ',
    'marriage.form.wifeSection': 'የሚስት መረጃ',
    'marriage.form.fullName': 'ሙሉ ስም',
    'marriage.form.age': 'እድሜ',
    'marriage.form.nationality': 'ዜግነት',
    'marriage.form.dateOfMarriage': 'የጋብቻ ቀን',
    'marriage.form.registerButton': 'ጋብቻ መዝግብ',

    // Divorce registration form
    'divorce.form.successTitle': 'የፍቺ መመዝገብ ተሳክቷል',
    'divorce.form.husbandSection': 'የባል መረጃ',
    'divorce.form.wifeSection': 'የሚስት መረጃ',
    'divorce.form.fullName': 'ሙሉ ስም',
    'divorce.form.age': 'እድሜ',
    'divorce.form.nationality': 'ዜግነት',
    'divorce.form.dateOfDivorce': 'የፍቺ ቀን',
    'divorce.form.requester': 'ጥያቄ ያቀረበው',
    'divorce.form.requester.husband': 'ባል',
    'divorce.form.requester.wife': 'ሚስት',
    'divorce.form.requester.both': 'ሁለቱም',
    'divorce.form.registerButton': 'ፍቺ መዝግብ',

    // Search records
    'search.form.title': 'መዝገቦች መፈለጊያ',
    'search.form.placeholder': 'በስም ወይም በመመዝገቢያ ቁጥር ፈልጉ...',
    'search.form.status': 'ሁኔታ',
    'search.form.status.all': 'ሁሉም ሁኔታዎች',
    'search.form.status.pending': 'በመጠባበቂያ',
    'search.form.status.approved': 'ተቀባይነት ያገኘ',
    'search.form.status.rejected': 'ተቀባይነት የሌለው',
    'search.form.recordType': 'የመዝገብ አይነት',
    'search.form.recordType.all': 'ሁሉም መዝገቦች',
    'search.form.recordType.birth': 'የውለድ መዝገቦች',
    'search.form.recordType.death': 'የሞት መዝገቦች',
    'search.form.recordType.marriage': 'የጋብቻ መዝገቦች',
    'search.form.recordType.divorce': 'የፍቺ መዝገቦች',

    'search.table.birth.title': 'የውለድ መዝገቦች',
    'search.table.death.title': 'የሞት መዝገቦች',
    'search.table.marriage.title': 'የጋብቻ መዝገቦች',
    'search.table.divorce.title': 'የፍቺ መዝገቦች',

    'search.table.column.regNo': 'መመዝገቢያ ቁ.',
    'search.table.column.childName': 'የልጅ ስም',
    'search.table.column.dateOfBirth': 'የውለድ ቀን',
    'search.table.column.parents': 'ወላጆች',
    'search.table.column.name': 'ስም',
    'search.table.column.dateOfDeath': 'የሞት ቀን',
    'search.table.column.cause': 'ምክንያት',
    'search.table.column.husband': 'ባል',
    'search.table.column.wife': 'ሚስት',
    'search.table.column.date': 'ቀን',
    'search.table.column.status': 'ሁኔታ',
    'search.table.column.actions': 'እርምጃዎች',
    'search.table.action.viewCertificate': 'ሰርተፍኬት ይመልከቱ',
  },
  om: {
    'layout.subtitle': 'Kebele Hermata Merkato - Jimmaa, Itiyoophiyaa',

    'page.dashboard': "Sirna Galmeessa Taateewwan Jireenyaa",
    'page.birth': 'Galmeessa Dhalootaa',
    'page.death': 'Galmeessa Du\'aa',
    'page.marriage': 'Galmeessa Fuudhaafi Heerumaa',
    'page.divorce': 'Galmeessa Divorsii',
    'page.search': 'Galmeewwan barbaadi',
    'page.certificates': 'Ejjannoo daawwachuu',

    'dashboard.welcomeTitle': 'Baga gara sirna galmeessa taateewwan jireenyaa dhuftan',
    'dashboard.welcomeBody':
      'Filannoo armaan gadii keessaa filadhaan taateewwan galmeessi, galmeewwan barbaadi yookaan ejjannoo maxxansi.',
    'dashboard.stats.births': 'Dhaloonni',
    'dashboard.stats.deaths': 'Du\'oonni',
    'dashboard.stats.marriages': 'Fuudhaaf Heerumni',
    'dashboard.stats.divorces': 'Divorsiin',

    'dashboard.card.birth.description': 'Dhaloota haaraa galmeessi fi ejjannoo kenni',
    'dashboard.card.death.description': 'Du\'a galmeessi fi ejjannoo du\'aa kenni',
    'dashboard.card.marriage.description': 'Fuudhaa fi heeruma galmeessi fi ejjannoo kenni',
    'dashboard.card.divorce.description': 'Divorsii galmeessi fi ejjannoo kenni',
    'dashboard.card.search.description': 'Galmeewwan duraan jiran barbaadi fi daawwadhu',
    'dashboard.card.certificates.description': 'Ejjannoo kenname daawwadhu fi maxxansi',

    'certificate.header.country': 'Rippabiliika Dimokraatawaa Federaalaa Itiyoophiyaa',
    'certificate.header.region': 'Naannoo Oromiyaa',
    'certificate.header.office': 'Biiroo Bulchiinsa Kebele Hermata Merkato',
    'certificate.header.city': 'Jimmaa, Itiyoophiyaa',

    'certificate.birth.title': 'EJJANNOO DHALOOTAA',
    'certificate.death.title': 'EJJANNOO DU\'AA',
    'certificate.marriage.title': 'EJJANNOO FUUDHAAFI HEERUMAA',
    'certificate.divorce.title': 'EJJANNOO DIVORSII',

    'certificate.field.registrationNumber': 'Lakkoofsa Galmee',
    'certificate.field.childFullName': 'Maqaa guutuu daa\'immaa',
    'certificate.field.dateOfBirth': 'Guyyaa dhalootaa',
    'certificate.field.sex': 'Saala',
    'certificate.field.nationality': 'Biyya abbaa',
    'certificate.field.motherFullName': 'Maqaa guutuu haadha',
    'certificate.field.fatherFullName': 'Maqaa guutuu abbaa',
    'certificate.field.placeOfBirth': 'Bakka dhalootaa',
    'certificate.field.registrationDate': 'Guyyaa galmee',

    'certificate.field.fullName': 'Maqaa guutuu',
    'certificate.field.dateOfDeath': 'Guyyaa du\'aa',
    'certificate.field.causeOfDeath': 'Sababaa du\'aa',
    'certificate.field.birthRegNumber': 'Lakkoofsa galmee dhalootaa',
    'certificate.field.lastKnownAddress': 'Teessoo dhumaa beekamu',

    'certificate.field.husband': 'Abbaa warraa',
    'certificate.field.wife': 'Haadha warraa',
    'certificate.field.age': 'Umrii',
    'certificate.field.address': 'Teessoo',
    'certificate.field.dateOfMarriage': 'Guyyaa fuudhaa fi heerumaa',
    'certificate.field.dateOfDivorce': 'Guyyaa divorsii',
    'certificate.field.requestedBy': 'Kan gaafate',

    'certificate.footer.issueDate': 'Guyyaa bahe',
    'certificate.footer.officialSignature': 'Mallattoo aangooftuu',
    'certificate.footer.kebeleAdministrator': 'Bulchaa Kebelee',

    'certificate.actions.print': 'Ejjannoo maxxansi',

    // Forms & search - common
    'common.form.addressSection': 'Odeeffannoo Teessoo',
    'common.form.city': 'Magaalaa',
    'common.form.kebele': 'Kebele',
    'common.form.houseNumber': 'Lakkoofsa Manaa',

    // Birth registration form
    'birth.form.successTitle': 'Galmeessi dhalootaa milkaaʼe',
    'birth.form.childName': 'Maqaa guutuu daa\'immaa',
    'birth.form.dateOfBirth': 'Guyyaa dhalootaa',
    'birth.form.sex': 'Saala',
    'birth.form.nationality': 'Biyya abbaa',
    'birth.form.motherName': 'Maqaa guutuu haadha',
    'birth.form.fatherName': 'Maqaa guutuu abbaa',
    'birth.form.registerButton': 'Dhaloota galmeessi',

    // Death registration form
    'death.form.successTitle': 'Galmeessi du\'aa milkaaʼe',
    'death.form.fullName': 'Maqaa guutuu',
    'death.form.birthRegNo': 'Lakkoofsa galmee dhalootaa',
    'death.form.optionalHint': 'Hanga danda’ame yoo jiraate',
    'death.form.dateOfBirth': 'Guyyaa dhalootaa',
    'death.form.dateOfDeath': 'Guyyaa du\'aa',
    'death.form.sex': 'Saala',
    'death.form.nationality': 'Biyya abbaa',
    'death.form.causeOfDeath': 'Sababaa du\'aa',
    'death.form.registerButton': 'Du\'a galmeessi',

    // Marriage registration form
    'marriage.form.successTitle': 'Galmeessi fuudhaa fi heerumaa milkaaʼe',
    'marriage.form.husbandSection': 'Odeeffannoo abbaa warraa',
    'marriage.form.wifeSection': 'Odeeffannoo haadha warraa',
    'marriage.form.fullName': 'Maqaa guutuu',
    'marriage.form.age': 'Umrii',
    'marriage.form.nationality': 'Biyya abbaa',
    'marriage.form.dateOfMarriage': 'Guyyaa fuudhaa fi heerumaa',
    'marriage.form.registerButton': 'Fuudhaa fi heeruma galmeessi',

    // Divorce registration form
    'divorce.form.successTitle': 'Galmeessi divorsii milkaaʼe',
    'divorce.form.husbandSection': 'Odeeffannoo abbaa warraa',
    'divorce.form.wifeSection': 'Odeeffannoo haadha warraa',
    'divorce.form.fullName': 'Maqaa guutuu',
    'divorce.form.age': 'Umrii',
    'divorce.form.nationality': 'Biyya abbaa',
    'divorce.form.dateOfDivorce': 'Guyyaa divorsii',
    'divorce.form.requester': 'Kan gaafate',
    'divorce.form.requester.husband': 'Abbaa warraa',
    'divorce.form.requester.wife': 'Haadha warraa',
    'divorce.form.requester.both': 'Lamaan isaanii',
    'divorce.form.registerButton': 'Divorsii galmeessi',

    // Search records
    'search.form.title': 'Galmeewwan barbaadi',
    'search.form.placeholder': 'Maqaa yookaan lakkoofsa galmee fayyadami...',
    'search.form.status': 'Haala',
    'search.form.status.all': 'Haala mara',
    'search.form.status.pending': 'Eegamaa jira',
    'search.form.status.approved': 'Mirmeessame',
    'search.form.status.rejected': 'Hafame',
    'search.form.recordType': 'Gosa galmee',
    'search.form.recordType.all': 'Galmeewwan hundaa',
    'search.form.recordType.birth': 'Galmeewwan dhalootaa',
    'search.form.recordType.death': 'Galmeewwan du\'aa',
    'search.form.recordType.marriage': 'Galmeewwan fuudhaa fi heerumaa',
    'search.form.recordType.divorce': 'Galmeewwan divorsii',

    'search.table.birth.title': 'Galmeewwan dhalootaa',
    'search.table.death.title': 'Galmeewwan du\'aa',
    'search.table.marriage.title': 'Galmeewwan fuudhaa fi heerumaa',
    'search.table.divorce.title': 'Galmeewwan divorsii',

    'search.table.column.regNo': 'Lakkoofsa galmee',
    'search.table.column.childName': 'Maqaa daa\'immaa',
    'search.table.column.dateOfBirth': 'Guyyaa dhalootaa',
    'search.table.column.parents': 'Maatii',
    'search.table.column.name': 'Maqaa',
    'search.table.column.dateOfDeath': 'Guyyaa du\'aa',
    'search.table.column.cause': 'Sababaa',
    'search.table.column.husband': 'Abbaa warraa',
    'search.table.column.wife': 'Haadha warraa',
    'search.table.column.date': 'Guyyaa',
    'search.table.column.status': 'Haala',
    'search.table.column.actions': 'Gochoota',
    'search.table.action.viewCertificate': 'Ejjannoo daawwadhu',
  },
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t: (key: string) => translations[language][key] ?? translations.en[key] ?? key,
    }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return ctx;
}

