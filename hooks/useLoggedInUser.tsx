import { account, database } from "@/app/appwrite";
import { Query } from "appwrite";
import { useEffect, useState } from "react";

type User = {
  id: string;
  email: string;
  username: string;
  profileUrl: string;
  description: string;
  theme: string;
};

const useLoggedInUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getLoggedInUser = async () => {
      try {
        const user = await account.get();

        if (user) {
          const { email } = user;
          if (email) {
            const existingUser = await database.listDocuments(
              process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
              process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_USER_ID!,
              [Query.equal("email", email)]
            );
            if (existingUser.total > 0) {
              const {
                $id: id,
                email,
                username,
                profileUrl,
                description,
                theme,
              } = existingUser.documents[0];
              setUser({ id, email, username, profileUrl, description, theme });
            }
          }
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    getLoggedInUser();
  }, []);

  return { ...user, loading };
};

export default useLoggedInUser;
