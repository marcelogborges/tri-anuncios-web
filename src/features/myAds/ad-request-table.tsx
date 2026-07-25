"use client"

import type { AdRequest } from "@/api/ad-request"
import { AdRequestTableRow } from "@/features/myAds/ad-request-table-row"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

type AdRequestTableProps = {
  adRequests: AdRequest[]
}

export const AdRequestTable = ({ adRequests }: AdRequestTableProps) => {
  const rows = adRequests.map(ad => <AdRequestTableRow key={ad.id} adRequest={ad} />)

  return (
    <div className="overflow-x-auto rounded-lg border bg-card">
      <Table className="min-w-[1190px] table-fixed">
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[260px]">Anúncio</TableHead>
            <TableHead className="w-[155px]">Status</TableHead>
            <TableHead className="w-[155px] text-right">Impressões</TableHead>
            <TableHead className="w-[155px] text-right">Cliques</TableHead>
            <TableHead className="w-[155px] text-right">Custo por clique</TableHead>
            <TableHead className="w-[155px] text-right">Investido</TableHead>
            <TableHead className="w-[155px] pr-6 text-right">Criado em</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>{rows}</TableBody>
      </Table>
    </div>
  )
}
