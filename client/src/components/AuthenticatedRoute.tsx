import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../utils/hooks/useAuth.ts";

type Props = {
	children: React.ReactNode;
};

const AuthenticatedRoute = ({ children }: Props) => {
	const location = useLocation();
	const { loading, user } = useAuth();

	if (loading) {
		return <div>loading</div>;
	}
	if (user) { return children; }
	return <Navigate to="/login" state={{ from: location }} replace />;
};

export default AuthenticatedRoute;
