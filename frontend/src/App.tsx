import { useState, useEffect, useCallback } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import BirthRegistration from './components/BirthRegistration';
import DeathRegistration from './components/DeathRegistration';
import MarriageRegistration from './components/MarriageRegistration';
import DivorceRegistration from './components/DivorceRegistration';
import SearchRecords from './components/SearchRecords';
import CertificateView from './components/CertificateView';
import ActivityLog from './components/ActivityLog';
import AdminGate from './components/AdminGate';
import AdminPage from './components/AdminPage';
import RegisterRequiresAdmin from './components/RegisterRequiresAdmin';
import {
  BirthRecord,
  DeathRecord,
  MarriageRecord,
  DivorceRecord,
  BirthCreatePayload,
  DeathCreatePayload,
  MarriageCreatePayload,
  DivorceCreatePayload,
  RecordStatus,
  StatsOverview,
} from './types';
import { birthsApi, deathsApi, marriagesApi, divorcesApi, statsApi } from './api';
import { useAuth } from './AuthContext';

type Page =
  | 'dashboard'
  | 'admin'
  | 'birth'
  | 'death'
  | 'marriage'
  | 'divorce'
  | 'search'
  | 'certificates'
  | 'activity';

type EditTarget =
  | { kind: 'birth'; record: BirthRecord }
  | { kind: 'death'; record: DeathRecord }
  | { kind: 'marriage'; record: MarriageRecord }
  | { kind: 'divorce'; record: DivorceRecord }
  | null;

function normalizeRecord<T>(r: T): T {
  const o = r as T & { created_at?: unknown; updated_at?: unknown };
  return {
    ...r,
    created_at: o.created_at != null ? String(o.created_at) : undefined,
    updated_at: o.updated_at != null ? String(o.updated_at) : undefined,
  } as T;
}

export default function App() {
  const { isAdmin } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [viewingCertificate, setViewingCertificate] = useState<{
    type: string;
    record: BirthRecord | DeathRecord | MarriageRecord | DivorceRecord;
  } | null>(null);

  const [birthRecords, setBirthRecords] = useState<BirthRecord[]>([]);
  const [deathRecords, setDeathRecords] = useState<DeathRecord[]>([]);
  const [marriageRecords, setMarriageRecords] = useState<MarriageRecord[]>([]);
  const [divorceRecords, setDivorceRecords] = useState<DivorceRecord[]>([]);
  const [statsOverview, setStatsOverview] = useState<StatsOverview | null>(null);
  const [editTarget, setEditTarget] = useState<EditTarget>(null);
  const [searchSession, setSearchSession] = useState<{ id: number; status: 'all' | RecordStatus }>({
    id: 0,
    status: 'all',
  });

  const goToPage = (page: Page, opts?: { searchStatus?: 'all' | RecordStatus }) => {
    setEditTarget(null);
    if (page === 'search') {
      const st = opts?.searchStatus ?? 'all';
      setSearchSession((prev) => ({ id: prev.id + 1, status: st }));
    }
    setCurrentPage(page);
  };

  const finishEdit = () => {
    goToPage('search', { searchStatus: 'all' });
  };

  const startEdit = (type: 'birth' | 'death' | 'marriage' | 'divorce', record: unknown) => {
    const r = record as { id?: string };
    if (!r?.id) return;
    if (type === 'birth') setEditTarget({ kind: 'birth', record: record as BirthRecord });
    else if (type === 'death') setEditTarget({ kind: 'death', record: record as DeathRecord });
    else if (type === 'marriage') setEditTarget({ kind: 'marriage', record: record as MarriageRecord });
    else setEditTarget({ kind: 'divorce', record: record as DivorceRecord });
    setCurrentPage(type);
  };
  const reloadRecords = useCallback(() => {
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

  useEffect(() => {
    if (isAdmin) {
      reloadRecords();
    } else {
      setBirthRecords([]);
      setDeathRecords([]);
      setMarriageRecords([]);
      setDivorceRecords([]);
    }
  }, [isAdmin, reloadRecords]);

  useEffect(() => {
    if (currentPage !== 'dashboard') return;
    if (!isAdmin) {
      setStatsOverview(null);
      return;
    }
    statsApi.overview().then((o) => setStatsOverview(o ?? null));
  }, [currentPage, isAdmin, birthRecords.length, deathRecords.length, marriageRecords.length, divorceRecords.length]);

  const handleBirthSubmit = async (record: BirthCreatePayload) => {
    const created = await birthsApi.create(record);
    const n = normalizeRecord(created) as BirthRecord;
    setBirthRecords((prev) => [n, ...prev]);
    return n;
  };

  const submitBirth = async (record: BirthCreatePayload) => {
    if (editTarget?.kind === 'birth' && editTarget.record.id) {
      const updated = await birthsApi.update(editTarget.record.id, record);
      const n = normalizeRecord(updated) as BirthRecord;
      setBirthRecords((prev) => prev.map((b) => (b.id === n.id ? n : b)));
      return n;
    }
    return handleBirthSubmit(record);
  };
  const handleDeathSubmit = async (record: DeathCreatePayload) => {
    const created = await deathsApi.create(record);
    const n = normalizeRecord(created) as DeathRecord;
    setDeathRecords((prev) => [n, ...prev]);
    return n;
  };

  const submitDeath = async (record: DeathCreatePayload) => {
    if (editTarget?.kind === 'death' && editTarget.record.id) {
      const updated = await deathsApi.update(editTarget.record.id, record);
      const n = normalizeRecord(updated) as DeathRecord;
      setDeathRecords((prev) => prev.map((d) => (d.id === n.id ? n : d)));
      return n;
    }
    return handleDeathSubmit(record);
  };
  const handleMarriageSubmit = async (record: MarriageCreatePayload) => {
    const created = await marriagesApi.create(record);
    const n = normalizeRecord(created) as MarriageRecord;
    setMarriageRecords((prev) => [n, ...prev]);
    return n;
  };

  const submitMarriage = async (record: MarriageCreatePayload) => {
    if (editTarget?.kind === 'marriage' && editTarget.record.id) {
      const updated = await marriagesApi.update(editTarget.record.id, record);
      const n = normalizeRecord(updated) as MarriageRecord;
      setMarriageRecords((prev) => prev.map((m) => (m.id === n.id ? n : m)));
      return n;
    }
    return handleMarriageSubmit(record);
  };
  const handleDivorceSubmit = async (record: DivorceCreatePayload) => {
    const created = await divorcesApi.create(record);
    const n = normalizeRecord(created) as DivorceRecord;
    setDivorceRecords((prev) => [n, ...prev]);
    return n;
  };

  const submitDivorce = async (record: DivorceCreatePayload) => {
    if (editTarget?.kind === 'divorce' && editTarget.record.id) {
      const updated = await divorcesApi.update(editTarget.record.id, record);
      const n = normalizeRecord(updated) as DivorceRecord;
      setDivorceRecords((prev) => prev.map((d) => (d.id === n.id ? n : d)));
      return n;
    }
    return handleDivorceSubmit(record);
  };
  const handleViewCertificate = (type: string, record: unknown) => {
    setEditTarget(null);
    setViewingCertificate({
      type,
      record: record as BirthRecord | DeathRecord | MarriageRecord | DivorceRecord,
    });
    setCurrentPage('certificates');
  };

  const getPageTitleKey = () => {
    switch (currentPage) {
      case 'admin':
        return 'page.admin';
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
      case 'activity':
        return 'page.activity';
      default:
        return 'page.dashboard';
    }
  };

  const goToAdmin = () => goToPage('admin');

  return (
    <Layout
      titleKey={getPageTitleKey()}
      onBack={currentPage !== 'dashboard' ? () => goToPage('dashboard') : undefined}
      onAdminNav={goToAdmin}
    >
      {currentPage === 'dashboard' && (
        <Dashboard
          onNavigate={(page, navOpts) => {
            if (page === 'search') {
              goToPage('search', { searchStatus: navOpts?.searchStatus ?? 'all' });
              return;
            }
            goToPage(page as Page);
          }}
          stats={{
            totalBirths: birthRecords.length,
            totalDeaths: deathRecords.length,
            totalMarriages: marriageRecords.length,
            totalDivorces: divorceRecords.length,
          }}
          statsOverview={statsOverview}
          isAdmin={isAdmin}
        />
      )}
      {currentPage === 'admin' && <AdminPage onNavigate={(p) => goToPage(p as Page)} />}
      {currentPage === 'birth' &&
        (!isAdmin ? (
          <RegisterRequiresAdmin onGoToAdmin={goToAdmin} />
        ) : (
          <BirthRegistration
            key={editTarget?.kind === 'birth' ? (editTarget.record.id ?? 'edit') : 'new-birth'}
            onSubmit={submitBirth}
            initialRecord={editTarget?.kind === 'birth' ? editTarget.record : null}
            onComplete={editTarget?.kind === 'birth' ? finishEdit : undefined}
          />
        ))}
      {currentPage === 'death' &&
        (!isAdmin ? (
          <RegisterRequiresAdmin onGoToAdmin={goToAdmin} />
        ) : (
          <DeathRegistration
            key={editTarget?.kind === 'death' ? (editTarget.record.id ?? 'edit') : 'new-death'}
            onSubmit={submitDeath}
            initialRecord={editTarget?.kind === 'death' ? editTarget.record : null}
            onComplete={editTarget?.kind === 'death' ? finishEdit : undefined}
          />
        ))}
      {currentPage === 'marriage' &&
        (!isAdmin ? (
          <RegisterRequiresAdmin onGoToAdmin={goToAdmin} />
        ) : (
          <MarriageRegistration
            key={editTarget?.kind === 'marriage' ? (editTarget.record.id ?? 'edit') : 'new-marriage'}
            onSubmit={submitMarriage}
            initialRecord={editTarget?.kind === 'marriage' ? editTarget.record : null}
            onComplete={editTarget?.kind === 'marriage' ? finishEdit : undefined}
          />
        ))}
      {currentPage === 'divorce' &&
        (!isAdmin ? (
          <RegisterRequiresAdmin onGoToAdmin={goToAdmin} />
        ) : (
          <DivorceRegistration
            key={editTarget?.kind === 'divorce' ? (editTarget.record.id ?? 'edit') : 'new-divorce'}
            onSubmit={submitDivorce}
            marriages={marriageRecords}
            initialRecord={editTarget?.kind === 'divorce' ? editTarget.record : null}
            onComplete={editTarget?.kind === 'divorce' ? finishEdit : undefined}
          />
        ))}
      {currentPage === 'search' && (
        <SearchRecords
          key={searchSession.id}
          defaultStatusFilter={searchSession.status}
          onViewCertificate={handleViewCertificate}
          onEditRecord={startEdit}
          onRecordsMutate={reloadRecords}
          births={birthRecords}
          deaths={deathRecords}
          marriages={marriageRecords}
          divorces={divorceRecords}
        />
      )}
      {currentPage === 'activity' && (isAdmin ? <ActivityLog /> : <AdminGate onGoToAdmin={goToAdmin} />)}
      {currentPage === 'certificates' && viewingCertificate && (
        <CertificateView type={viewingCertificate.type} record={viewingCertificate.record} />
      )}
    </Layout>
  );
}
