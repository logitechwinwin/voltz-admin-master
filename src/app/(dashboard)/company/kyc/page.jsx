"use client";

import React from "react";

import { NgoKyc } from "@/component";
import { ROLES } from "@/constant";

const Kyc = () => {
  return <NgoKyc type={ROLES.COMPANY} />;
};

export default Kyc;
