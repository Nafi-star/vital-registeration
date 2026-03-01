import { useState } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import BirthRegistration from './components/BirthRegistration';
import DeathRegistration from './components/DeathRegistration';
import MarriageRegistration from './components/MarriageRegistration';
import DivorceRegistration from './components/DivorceRegistration';
import SearchRecords from './components/SearchRecords';
import CertificateView from './components/CertificateView';
import { BirthRecord, DeathRecord, MarriageRecord, DivorceRecord } from './types';
import {
  initialBirthRecords,
  initialDeathRecords,
  initialMarriageRecords,
  initialDivorceRecords,
} from './mockRecords';

type Page = 'dashboard' | 'birth' | 'death' | 'marriage' | 'divorce' | 'search' | 'certificates';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [viewingCertificate, setViewingCertificate] = useState<{
    type: string;
    record: BirthRecord | DeathRecord | MarriageRecord | DivorceRecord;
  } | null>(null);

  const [birthRecords, setBirthRecords] = useState<BirthRecord[]>(initialBirthRecords);
  const [deathRecords, setDeathRecords] = useState<DeathRecord[]>(initialDeathRecords);
  const [marriageRecords, setMarriageRecords] = useState<MarriageRecord[]>(initialMarriageRecords);
  const [divorceRecords, setDivorceRecords] = useState<DivorceRecord[]>(initialDivorceRecords);

  const handleBirthSubmit = (record: BirthRecord) => {
    const now = new Date().toISOString();
    const completeRecord: BirthRecord = {
      ...record,
      status: 'Pending',
      created_at: now,
      updated_at: now,
    };
    setBirthRecords((prev) => [completeRecord, ...prev]);
  };

  const handleDeathSubmit = (record: DeathRecord) => {
    const now = new Date().toISOString();
    const completeRecord: DeathRecord = {
      ...record,
      status: 'Pending',
      created_at: now,
      updated_at: now,
    };
    setDeathRecords((prev) => [completeRecord, ...prev]);
  };

  const handleMarriageSubmit = (record: MarriageRecord) => {
    const now = new Date().toISOString();
    const completeRecord: MarriageRecord = {
      ...record,
      status: 'Pending',
      created_at: now,
      updated_at: now,
    };
    setMarriageRecords((prev) => [completeRecord, ...prev]);
  };

  const handleDivorceSubmit = (record: DivorceRecord) => {
    const now = new Date().toISOString();
    const completeRecord: DivorceRecord = {
      ...record,
      status: 'Pending',
      created_at: now,
      updated_at: now,
    };
    setDivorceRecords((prev) => [completeRecord, ...prev]);
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
