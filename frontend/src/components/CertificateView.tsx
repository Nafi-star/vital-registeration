import { Printer } from 'lucide-react';
import { BirthRecord, DeathRecord, MarriageRecord, DivorceRecord } from '../types';
import { useLanguage } from '../LanguageContext';

interface CertificateViewProps {
  type: string;
  record: BirthRecord | DeathRecord | MarriageRecord | DivorceRecord;
}

export function CertificateView({ type, record }: CertificateViewProps) {
  const { t } = useLanguage();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div>
      <div className="mb-6 print:hidden">
        <button
          onClick={handlePrint}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-colors"
        >
          <Printer className="w-4 h-4" />
          {t('certificate.actions.print')}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg border-4 border-slate-800 p-12 print:shadow-none print:border-2">
        <div className="text-center mb-8 border-b-4 border-slate-800 pb-6">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            {t('certificate.header.country')}
          </h1>
          <h2 className="text-2xl font-semibold text-slate-700 mb-2">
            {t('certificate.header.region')}
          </h2>
          <h3 className="text-xl text-slate-600">
            {t('certificate.header.office')}
          </h3>
          <p className="text-sm text-slate-500 mt-2">{t('certificate.header.city')}</p>
        </div>

        {type === 'birth' && <BirthCertificate record={record as BirthRecord} />}
        {type === 'death' && <DeathCertificate record={record as DeathRecord} />}
        {type === 'marriage' && <MarriageCertificate record={record as MarriageRecord} />}
        {type === 'divorce' && <DivorceCertificate record={record as DivorceRecord} />}

        <div className="mt-12 pt-8 border-t-2 border-slate-300">
          <div className="flex justify-between items-end">
            <div>
              <p className="text-sm text-slate-600 mb-1">{t('certificate.footer.issueDate')}:</p>
              <p className="font-semibold text-slate-900">
                {new Date().toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <div className="border-t-2 border-slate-800 pt-2 min-w-[200px]">
                <p className="text-sm font-semibold text-slate-900">
                  {t('certificate.footer.officialSignature')}
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  {t('certificate.footer.kebeleAdministrator')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CertificateView;

function BirthCertificate({ record }: { record: BirthRecord }) {
  const { t } = useLanguage();

  return (
    <div>
      <h2 className="text-3xl font-bold text-center text-blue-600 mb-8">
        {t('certificate.birth.title')}
      </h2>
      <div className="space-y-4">
        <InfoRow label={t('certificate.field.registrationNumber')} value={record.birth_regno} />
        <InfoRow label={t('certificate.field.childFullName')} value={record.child_name} />
        <InfoRow label={t('certificate.field.dateOfBirth')} value={record.date_of_birth} />
        <InfoRow label={t('certificate.field.sex')} value={record.sex} />
        <InfoRow label={t('certificate.field.nationality')} value={record.nationality} />
        <InfoRow label={t('certificate.field.motherFullName')} value={record.mother_name} />
        <InfoRow label={t('certificate.field.fatherFullName')} value={record.father_name} />
        <InfoRow
          label={t('certificate.field.placeOfBirth')}
          value={`${record.city}, ${record.kebele}, House No. ${record.house_number}`}
        />
        <InfoRow label={t('certificate.field.registrationDate')} value={record.registration_date} />
      </div>
    </div>
  );
}

function DeathCertificate({ record }: { record: DeathRecord }) {
  const { t } = useLanguage();

  return (
    <div>
      <h2 className="text-3xl font-bold text-center text-slate-700 mb-8">
        {t('certificate.death.title')}
      </h2>
      <div className="space-y-4">
        <InfoRow label={t('certificate.field.registrationNumber')} value={record.death_regno} />
        <InfoRow label={t('certificate.field.fullName')} value={record.name} />
        <InfoRow label={t('certificate.field.dateOfBirth')} value={record.date_of_birth} />
        <InfoRow label={t('certificate.field.dateOfDeath')} value={record.date_of_death} />
        <InfoRow label={t('certificate.field.sex')} value={record.sex} />
        <InfoRow label={t('certificate.field.nationality')} value={record.nationality} />
        <InfoRow label={t('certificate.field.causeOfDeath')} value={record.cause_of_death} />
        {record.birth_regno && (
          <InfoRow label={t('certificate.field.birthRegNumber')} value={record.birth_regno} />
        )}
        <InfoRow
          label={t('certificate.field.lastKnownAddress')}
          value={`${record.city}, ${record.kebele}, House No. ${record.house_number}`}
        />
        <InfoRow label={t('certificate.field.registrationDate')} value={record.registration_date} />
      </div>
    </div>
  );
}

function MarriageCertificate({ record }: { record: MarriageRecord }) {
  const { t } = useLanguage();

  return (
    <div>
      <h2 className="text-3xl font-bold text-center text-rose-600 mb-8">
        {t('certificate.marriage.title')}
      </h2>
      <div className="space-y-4">
        <InfoRow label={t('certificate.field.registrationNumber')} value={record.marriage_regno} />
        <div className="bg-slate-50 rounded-lg p-4 my-4">
          <h3 className="font-semibold text-slate-900 mb-3">
            {t('certificate.field.husband')}
          </h3>
          <InfoRow label={t('certificate.field.fullName')} value={record.husband_name} />
          <InfoRow label={t('certificate.field.age')} value={record.husband_age.toString()} />
          <InfoRow
            label={t('certificate.field.nationality')}
            value={record.husband_nationality}
          />
        </div>
        <div className="bg-slate-50 rounded-lg p-4 my-4">
          <h3 className="font-semibold text-slate-900 mb-3">
            {t('certificate.field.wife')}
          </h3>
          <InfoRow label={t('certificate.field.fullName')} value={record.wife_name} />
          <InfoRow label={t('certificate.field.age')} value={record.wife_age.toString()} />
          <InfoRow label={t('certificate.field.nationality')} value={record.wife_nationality} />
        </div>
        <InfoRow
          label={t('certificate.field.dateOfMarriage')}
          value={record.date_of_marriage}
        />
        <InfoRow
          label={t('certificate.field.address')}
          value={`${record.city}, ${record.kebele}, House No. ${record.house_number}`}
        />
        <InfoRow label={t('certificate.field.registrationDate')} value={record.registration_date} />
      </div>
    </div>
  );
}

function DivorceCertificate({ record }: { record: DivorceRecord }) {
  const { t } = useLanguage();

  return (
    <div>
      <h2 className="text-3xl font-bold text-center text-amber-600 mb-8">
        {t('certificate.divorce.title')}
      </h2>
      <div className="space-y-4">
        <InfoRow label={t('certificate.field.registrationNumber')} value={record.divorce_regno} />
        <div className="bg-slate-50 rounded-lg p-4 my-4">
          <h3 className="font-semibold text-slate-900 mb-3">
            {t('certificate.field.husband')}
          </h3>
          <InfoRow label={t('certificate.field.fullName')} value={record.husband_name} />
          <InfoRow label={t('certificate.field.age')} value={record.husband_age.toString()} />
          <InfoRow
            label={t('certificate.field.nationality')}
            value={record.husband_nationality}
          />
        </div>
        <div className="bg-slate-50 rounded-lg p-4 my-4">
          <h3 className="font-semibold text-slate-900 mb-3">
            {t('certificate.field.wife')}
          </h3>
          <InfoRow label={t('certificate.field.fullName')} value={record.wife_name} />
          <InfoRow label={t('certificate.field.age')} value={record.wife_age.toString()} />
          <InfoRow label={t('certificate.field.nationality')} value={record.wife_nationality} />
        </div>
        <InfoRow
          label={t('certificate.field.dateOfDivorce')}
          value={record.date_of_divorce}
        />
        <InfoRow label={t('certificate.field.requestedBy')} value={record.requester} />
        <InfoRow
          label={t('certificate.field.address')}
          value={`${record.city}, ${record.kebele}, House No. ${record.house_number}`}
        />
        <InfoRow label={t('certificate.field.registrationDate')} value={record.registration_date} />
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex border-b border-slate-200 pb-2">
      <span className="font-semibold text-slate-700 min-w-[200px]">{label}:</span>
      <span className="text-slate-900">{value}</span>
    </div>
  );
}
