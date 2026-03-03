import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import BirthRegistration from './components/BirthRegistration';
import DeathRegistration from './components/DeathRegistration';
import MarriageRegistration from './components/MarriageRegistration';
import DivorceRegistration from './components/DivorceRegistration';
import SearchRecords from './components/SearchRecords';
import CertificateView from './components/CertificateView';
import { BirthRecord, DeathRecord, MarriageRecord, DivorceRecord } from './types';
import { birthsApi, deathsApi, marriagesApi, divorcesApi } from './api';

type Page = 'dashboard' | 'birth' | 'death' | 'marriage' | 'divorce' | 'search' | 'certificates';

function normalizeRecord<T>(r: T): T {
  const o = r as T & { created_at?: unknown; updated_at?: unknown };
  return {
    ...r,
    created_at: o.created_at != null ? String(o.created_at) : undefined,
    updated_at: o.updated_at != null ? String(o.updated_at) : undefined,
  } as T;
}

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [viewingCertificate, setViewingCertificate] = useState<{
    type: string;
    record: BirthRecord | DeathRecord | MarriageRecord | DivorceRecord;
  } | null>(null);

  const [birthRecords, setBirthRecords] = useState<BirthRecord[]>([]);
  const [deathRecords, setDeathRecords] = useState<DeathRecord[]>([]);
  const [marriageRecords, setMarriageRecords] = useState<MarriageRecord[]>([]);
  const [divorceRecords, setDivorceRecords] = useState<DivorceRecord[]>([]);

  useEffect(() => {
    Promise.all([
      birthsApi.getAll(),
      deathsApi.getAll(),
      marriagesApi.getAll(),
      divorcesApi.getAll(),
    ]).then(([births, deaths, marriages, divorces]) => {
      setBirthRecords(births.map(normalizeRecord) as BirthRecord[]);
      setDeathRecords(deaths.map(normalizeRecord) as DeathRecord[]);
      setMarriageRecords(marriages.map(normalizeRecord) as MarriageRecord[]);
      setDivorceRecords(divorces.map(normalizeRecord) as DivorceRecord[]);
    });
  }, []);

  const handleBirthSubmit = (record: BirthRecord) => {
    birthsApi
      .create(record)
      .then((created) => setBirthRecords((prev) => [normalizeRecord(created), ...prev]))
      .catch(console.error);
  };

  const handleDeathSubmit = (record: DeathRecord) => {
    deathsApi
      .create(record)
      .then((created) => setDeathRecords((prev) => [normalizeRecord(created), ...prev]))
      .catch(console.error);
  };

  const handleMarriageSubmit = (record: MarriageRecord) => {
    marriagesApi
      .create(record)
      .then((created) => setMarriageRecords((prev) => [normalizeRecord(created), ...prev]))
      .catch(console.error);
  };

  const handleDivorceSubmit = (record: DivorceRecord) => {
    divorcesApi
      .create(record)
      .then((created) => setDivorceRecords((prev) => [normalizeRecord(created), ...prev]))
      .catch(console.error);
  };

  const handleViewCertificate = (type: string, record: unknown) => {
    setViewingCertificate({
      type,
      record: record as BirthRecord | DeathRecord | MarriageRecord | DivorceRecord,
    });
    setCurrentPage('certificates');
  };

  const getPageTitleKey = () => {
    switch (currentPage) {
      case 'birth':
        return 'page.birth';
      case 'death':
        return 'page.death';
      case 'marriage':
        return 'page.marriage';
      case 'divorce':
        return 'page.divorce';
      case 'search':
        return 'page.search';
      case 'certificates':
        return 'page.certificates';
      default:
        return 'page.dashboard';
    }
  };

  return (
    <Layout
      titleKey={getPageTitleKey()}
      onBack={currentPage !== 'dashboard' ? () => setCurrentPage('dashboard') : undefined}
    >
      {currentPage === 'dashboard' && (
        <Dashboard
          onNavigate={(page) => setCurrentPage(page as Page)}
          stats={{
            totalBirths: birthRecords.length,
            totalDeaths: deathRecords.length,
            totalMarriages: marriageRecords.length,
            totalDivorces: divorceRecords.length,
          }}
        />
      )}
      {currentPage === 'birth' && <BirthRegistration onSubmit={handleBirthSubmit} />}
      {currentPage === 'death' && <DeathRegistration onSubmit={handleDeathSubmit} />}
      {currentPage === 'marriage' && <MarriageRegistration onSubmit={handleMarriageSubmit} />}
      {currentPage === 'divorce' && <DivorceRegistration onSubmit={handleDivorceSubmit} />}
      {currentPage === 'search' && (
        <SearchRecords
          onViewCertificate={handleViewCertificate}
          births={birthRecords}
          deaths={deathRecords}
          marriages={marriageRecords}
          divorces={divorceRecords}
        />
      )}
      {currentPage === 'certificates' && viewingCertificate && (
        <CertificateView type={viewingCertificate.type} record={viewingCertificate.record} />
      )}
    </Layout>
  );
}

export default App;
