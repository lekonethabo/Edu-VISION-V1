import { useState, useEffect } from 'react';
import * as api from '../services/api';

export const useDashboardData = (filters: { year: string; region: string }) => {
  const [data, setData] = useState<any>({
    stats: null,
    enrolmentTrends: null,
    regionalDistribution: null,
    studentDemographics: null,
    dropoutAnalysis: null,
    alerts: null
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const loadAllData = async () => {
      setIsLoading(true);
      try {
        const [
          stats,
          enrolmentTrends,
          regionalDistribution,
          studentDemographics,
          dropoutAnalysis,
          alerts
        ] = await Promise.all([
          api.fetchDashboardStats(filters),
          api.fetchEnrolmentTrends(filters),
          api.fetchRegionalDistribution(filters),
          api.fetchStudentDemographics(filters),
          api.fetchDropoutAnalysis(filters),
          api.fetchAlerts()
        ]);
        
        if (isMounted) {
          setData({
            stats,
            enrolmentTrends,
            regionalDistribution,
            studentDemographics,
            dropoutAnalysis,
            alerts
          });
          setIsLoading(false);
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err);
          setIsLoading(false);
        }
      }
    };

    loadAllData();

    return () => {
      isMounted = false;
    };
  }, [filters.year, filters.region]); // eslint-disable-line react-hooks/exhaustive-deps

  return { data, isLoading, error };
};

