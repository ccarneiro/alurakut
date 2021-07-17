import react from 'react';
import nookies from 'nookies';

export default function LogoutPage() {
  return <span>Saindo...</span>;
}

export async function getServerSideProps(context) {
  nookies.destroy(context, 'USER_TOKEN');
  return {
    redirect: {
      destination: '/login',
      permanent: false,
    },
  };
}
