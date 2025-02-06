import Link from "next/link";
import { useRouter } from "next/router";

export function Breadcrumbs() {
  const { route, query } = useRouter();

  const generateBreadcrumbs = () => {
    const pathArray = route.split("/").filter((path) => path);
    return pathArray.map(() => ({
      href: "/" + query.directory,
      label: query.directory
    }));
  };

  const breadcrumbs = generateBreadcrumbs();
  const subdirectory = route !== "/";

  return (
    <nav aria-label="breadcrumb flex">
      <ol className="p-4 w-full flex flex-row gap text-md">
        <li className="breadcrumb-item">
          <Link
            className={`${!subdirectory ? "text-gray-500" : "text-gray-900"} font-extrabold`}
            href="/">
            Home
          </Link>
        </li>
        {breadcrumbs.map((breadcrumb, index) => (
          <li key={index} className="breadcrumb-item text-capitalize font-bold flex gap-0 pl-3">
            <span className="size-2 w-4">/</span>
            <Link className="capitalize text-bold text-gray-500" href={breadcrumb.href}>
              {breadcrumb.label}
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
