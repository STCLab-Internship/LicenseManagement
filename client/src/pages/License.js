import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import LicenseList from '../components/License/LicenseList'

const License = () => {

  // 새로운 QueryClient 인스턴스 생성
  const queryClient = new QueryClient();

  return (
    <>
       <QueryClientProvider client={queryClient}>
          <LicenseList/>
      </QueryClientProvider>
    </>
)
            };

export default License;