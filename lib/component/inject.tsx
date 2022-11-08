"use client"

import { FC, ReactNode } from "react";

const Inject: FC<{
	children: ReactNode;
}> = ({children}) => {
	return <>
		{children}
	</>
}

export default Inject