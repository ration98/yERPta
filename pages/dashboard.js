// pages/dashboard.js
import { verifyToken } from "../lib/auth";

export const getServerSideProps = async (context) => {
  const user = verifyToken(context.req);
  console.log("user: ",user);

  if (!user) {
    return {
      redirect: {
        destination: "/authentication/sign-in/basic",
        permanent: false,
      },
    };
  }

  return {
    props: { user },
  };
};

// export default function DashboardPage({ user }) {
//   return <div>Welcome, {user.email}</div>;
// }
