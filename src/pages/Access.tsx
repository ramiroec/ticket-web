import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Access: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // El acceso por token ya no es necesario
    // Redirigir al login estándar
    navigate('/login/choice');
  }, [navigate]);

  return <div>Redirigiendo...</div>;
};

export default Access;
