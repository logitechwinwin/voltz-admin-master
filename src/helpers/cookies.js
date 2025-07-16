"use server";

import { cookies } from "next/headers";


// Function to create a cookie
async function createCookie(value) {
  cookies().set({
    name: '@ACCESS_TOKEN',
    value: value,
    httpOnly: true,
    path: "/",
  });
}

// Function to delete a cookie
async function deleteCookie() {
  cookies().delete('@ACCESS_TOKEN');
}

export { createCookie, deleteCookie };
