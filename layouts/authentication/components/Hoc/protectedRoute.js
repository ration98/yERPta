import { useUser } from "../../../../context/userContext";
import { useRouter } from "next/router";
import { useEffect } from "react";

function ProtectedRoute({ children }) {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user || !user.namaPengguna) {
      // Redirect ke halaman login jika user belum login
        //   router.push("/authentication/sign-in/basic");.
        router.replace("/authentication/sign-in/basic");
    }
  }, [user]);

  return children;
}

export default ProtectedRoute;