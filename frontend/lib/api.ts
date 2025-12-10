'use client';

import axios from 'axios';
import { useAuth } from '../app/auth-context';

export const api = axios.create({
  baseURL: 'http://localhost:4000',
});
