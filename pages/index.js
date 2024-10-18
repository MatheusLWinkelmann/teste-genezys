export default function Home() {
  return null;
}

export async function getServerSideProps(context) {
  const { req } = context;
  const host = req.headers.host;

  if (host.includes('localhost') && req.url === '/') {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}
