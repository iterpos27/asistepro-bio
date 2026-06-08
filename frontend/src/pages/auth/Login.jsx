import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { BarChart3, MapPin, ScanFace, ShieldCheck } from 'lucide-react';
import Feature from '../../components/common/Feature';
import { api, setSession } from '../../services/api';

const loginSchema = z.object({
  email: z.string().email('Email invalido'),
  password: z.string().min(1, 'Password requerido'),
});

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'superadmin@asistepro.local',
      password: 'Admin123*',
    },
  });

  async function submit(values) {
    setServerError('');
    const response = await api.post('/auth/login', values).catch((error) => {
      setServerError(error.response?.data?.message || 'No se pudo iniciar sesion');
      return null;
    });

    if (!response) return;

    const { user, tokens } = response.data.data;
    setSession({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user,
    });
    onLogin(user);
    navigate('/dashboard');
  }

  return (
    <main className="login-screen">
      <section className="login-brand">
        <div className="brand-mark">
          <ScanFace size={24} />
          <span>AsistePro</span>
        </div>
        <div>
          <h1>Control de asistencia multi-sucursal con QR + GPS.</h1>
          <p>Gestiona empresas, sucursales, empleados, horarios, marcaciones y reportes desde una consola SaaS.</p>
        </div>
        <div className="brand-highlights">
          <Feature icon={MapPin} title="Geocercas" text="Validacion por radio y ubicacion real." />
          <Feature icon={ShieldCheck} title="Multi tenant" text="Datos aislados por empresa." />
          <Feature icon={BarChart3} title="Reportes" text="Asistencia diaria, mensual y novedades." />
        </div>
      </section>
      <section className="login-panel">
        <form className="login-form" onSubmit={handleSubmit(submit)}>
          <div className="mobile-brand">
            <ScanFace size={22} />
            <span>AsistePro</span>
          </div>
          <div>
            <h2>Iniciar sesion</h2>
            <p>Accede a tu panel operativo.</p>
          </div>
          <label>
            Email
            <input {...register('email')} type="email" autoComplete="email" />
            {errors.email && <small>{errors.email.message}</small>}
          </label>
          <label>
            Password
            <div className="password-row">
              <input {...register('password')} type={showPassword ? 'text' : 'password'} />
              <button type="button" onClick={() => setShowPassword((value) => !value)}>
                {showPassword ? 'Ocultar' : 'Ver'}
              </button>
            </div>
            {errors.password && <small>{errors.password.message}</small>}
          </label>
          {serverError && <div className="alert-error">{serverError}</div>}
          <button className="primary-button" disabled={isSubmitting}>
            {isSubmitting ? 'Validando...' : 'Entrar'}
          </button>
        </form>
      </section>
    </main>
  );
}
