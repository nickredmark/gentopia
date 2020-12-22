import { stringify } from "qs";
import { useRouter } from "next/router";

export const useRouterState = (defaults: any) => {
  const router = useRouter();
  return [
    { ...defaults, ...router.query },
    (update) => {
      const url = `${router.pathname}?${stringify(
        {
          ...router.query,
          ...update,
        },
        {
          encode: false,
        }
      )}`;
      router.push(url, undefined, { shallow: true });
    },
  ];
};
