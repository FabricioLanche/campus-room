import { RegisterForm } from '../components/RegisterForm';
import { useAuth } from '../context/AuthContext';

export const Register = () => {
  const { register } = useAuth();

  return (
    <section className="mx-auto flex max-w-md flex-col gap-4 px-4 py-10">
      <div className="space-y-2 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-secondary">Nuevo perfil</p>
        <h2 className="text-2xl font-bold text-slate-900">Crea tu cuenta en CampusRoom</h2>
        <p className="text-sm text-slate-600">Registra tus datos para publicar y guardar avisos.</p>
      </div>
      <RegisterForm onSubmit={register} />
    </section>
  );
};
