import { useContext } from 'react';
import { CRMContext } from '../context/CRMContent';

export const useCRM = () => useContext(CRMContext);