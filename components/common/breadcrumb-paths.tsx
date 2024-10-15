import { BreadcrumbType } from "@/types"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb"

interface BreadcrumbPathsProps {
  initialPage?: boolean
  breadcrumb?: BreadcrumbType[]
}

export function BreadcrumbPaths({
  initialPage,
  breadcrumb,
}: BreadcrumbPathsProps) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {initialPage && (
          <BreadcrumbItem>
            <BreadcrumbPage>Inicio</BreadcrumbPage>
          </BreadcrumbItem>
        )}
        {!initialPage && (
          <BreadcrumbItem>
            <BreadcrumbLink href="/dashboard">Inicio</BreadcrumbLink>
          </BreadcrumbItem>
        )}
        {!initialPage && breadcrumb && (
          <>
            {breadcrumb.map(({ href, label }, i) => (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {i !== breadcrumb.length - 1 && (
                    <BreadcrumbLink href={href}>{label}</BreadcrumbLink>
                  )}
                  {i === breadcrumb.length - 1 && (
                    <BreadcrumbPage>{label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </>
            ))}
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
