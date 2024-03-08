import { FullScreenLoader } from '@/components/loaders/fullScreenLoader';
import { SocketProvider } from '@/contexts/socketContext';
import { getBackendUrl, getPageTitle, loadingPageTitle } from '@/lib/utils';
import { Content } from '@/screens/lab/sections/content';
import { TitleBar } from '@/screens/lab/sections/titleBar';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';

export const Lab = () => {
  const { labId } = useParams();
  const navigate = useNavigate();
  const [lab, setLab] = useState(null);

  useEffect(() => {
    setLab(null);

    fetch(getBackendUrl(`/v1/labs/${labId}/start`), { method: 'POST' })
      .then(async (response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(await response.json());
        }
      })
      .then((lab) => {
        setLab(lab.lab);
      })
      .catch((error) => {
        toast.error(error?.message?.message || 'Lab not found');
        navigate('/');
      });

    return () => {
      fetch(getBackendUrl(`/v1/labs/${labId}/stop`), { method: 'POST' });
    };
  }, []);

  if (!lab) {
    return (
      <>
        <Helmet>
          <title>{loadingPageTitle}</title>
        </Helmet>
        <FullScreenLoader />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>{getPageTitle(lab.name)}</title>
      </Helmet>
      <SocketProvider labName={lab.name}>
        <div className="flex flex-col flex-1 w-full h-full max-h-full">
          <TitleBar
            name={lab.name}
            flags={lab.flags}
            initialCompletedFlags={lab.completedFlags}
          />
          <Content />
        </div>
      </SocketProvider>
    </>
  );
};
