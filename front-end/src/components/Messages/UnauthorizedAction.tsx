import Link from "next/link";
import React from "react";

const UnauthorizedMessage : React.ReactElement = (
  <>
    Pour utiliser cette fonctionnalité, veuillez vous{" "}
    <Link href="/signin" className="underline text-blue-500">
      connecter
    </Link>
    .
  </>
);

export default UnauthorizedMessage;
