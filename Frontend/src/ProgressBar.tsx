import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

const RouteChangeProgress: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    NProgress.start();

    // Simulate loading completion after a delay
    const timer = setTimeout(() => {
      NProgress.done();
    }, 300);

    return () => {
      clearTimeout(timer);
      NProgress.done();
    };
  }, [location.pathname]);

  return null;
};

export default RouteChangeProgress;
