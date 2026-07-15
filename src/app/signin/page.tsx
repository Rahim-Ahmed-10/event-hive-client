import SignIn from '@/components/SignIn';
import React, { Suspense } from 'react';

const SignInPage = () => {
  return (
    <div>
      <Suspense fallback="Loading...">
        <SignIn />
      </Suspense>
    </div>
  );
};

export default SignInPage;