import { AngleRight } from "@/assets/svgs";
import React from "react";
import { Link } from "react-router-dom";

export interface Crumb {
  name: string;
  path?: string;
}

interface BreadcrumbsProps {
  crumbs: Crumb[];
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ crumbs }) => {
  return (
    <nav className="w-full overflow-hidden">
      <ol className="m-0 flex flex-wrap items-center gap-1 text-sm md:text-base">
        {crumbs.map((crumb, index) => (
          <React.Fragment key={index}>
            <li className="truncate font-medium text-sm text-BR400 last:text-gray-600 hover:text-BR500 last:hover:text-gray-600">
              {crumb.path ? (
                <Link to={crumb.path} replace>
                  <p className="text-[inherit] capitalize transition-colors duration-200 hover:underline">
                    {crumb.name}
                  </p>
                </Link>
              ) : (
                <span className="text-[inherit] capitalize transition-colors duration-200">
                  {crumb.name}
                </span>
              )}
            </li>
            {index < crumbs.length - 1 && (
              <span className="mx-1 text-gray-400">
                <AngleRight />
              </span>
            )}
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
};
