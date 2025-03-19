import React, { Suspense } from 'react';
import RegistrationForm from './registrationForm';

export default function JudgeRegistrationPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="text-xl font-semibold">Загрузка...</div></div>}>
      <RegistrationForm />
    </Suspense>
  );
}