import {LoaderFunctionArgs} from '@remix-run/node';

export const loader = async ({params}: LoaderFunctionArgs) => {
    const { name } = params;
    return Response.json({
    name: name,
  });
};
