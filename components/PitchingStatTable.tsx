/* eslint-disable react/display-name */

import * as React from "react";

import { Cell, Column } from "react-table";
import PlayerStats from "types/playerStats";
import StatSplit from "types/statSplit";
import Team from "types/team";

import NextLink from "next/link";
import Table from "components/Table";
import { Flex, Link, Tooltip } from "@chakra-ui/react";

type StatTableProps = {
  careerPitchingStats;
  isPostseason?: boolean;
  pitchingStats: PlayerStats;
  statTargetName: string;
};

export default function PitchingStatTable({
  careerPitchingStats,
  isPostseason = false,
  pitchingStats,
  statTargetName,
}: StatTableProps) {
  const data = React.useMemo<StatSplit[]>(() => pitchingStats.splits, [
    statTargetName,
  ]);
  const careerData = careerPitchingStats.splits[0];

  const columns = React.useMemo<
    Column<StatSplit & { season: number; teamName: typeof NextLink | null }>[]
  >(
    () => [
      {
        accessor: "season",
        Header: () => (
          <Tooltip closeOnClick={false} hasArrow label="Year" placement="top">
            Yr
          </Tooltip>
        ),
        Cell: ({ value }: Cell<StatSplit>) => {
          // Return an asterisk for seasons 1 and 2 due to limited data
          return [0, 1].includes(Number(value))
            ? `${Number(value) + 1}*`
            : Number(value) + 1;
        },
      },
      {
        accessor: "teamName",
        Header: () => (
          <Tooltip closeOnClick={false} hasArrow label="Team" placement="top">
            Tm
          </Tooltip>
        ),
        Cell: ({ row }: Cell<StatSplit>) => {
          const team: Team | undefined = row.original.team;

          return team && team.url_slug ? (
            <NextLink href={`/teams/${team.url_slug}`} passHref>
              <Link>{team.nickname}</Link>
            </NextLink>
          ) : null;
        },
      },
      // @ts-expect-error: Type not assignable error
      ...commonPitchingStatColumns(careerData),
    ],
    [isPostseason, statTargetName]
  );

  return (
    <Table columns={columns} data={data}>
      <Flex alignContent="center" justifyContent="space-between" mb={1}>
        <Table.Heading>
          {isPostseason
            ? "Postseason Pitching Stats"
            : "Standard Pitching Stats"}
        </Table.Heading>
        <Flex alignItems="center">
          <Table.CSVExport
            filename={`${statTargetName} ${
              isPostseason ? "Postseason" : "Regular Season"
            } Pitching Stats.csv`}
          />
        </Flex>
      </Flex>
      <Table.Content />
    </Table>
  );
}

export function commonPitchingStatColumns(
  summaryData: StatSplit
): Column<StatSplit>[] {
  return [
    {
      accessor: (row) => row.stat.wins,
      id: "wins",
      Header: () => (
        <Tooltip closeOnClick={false} hasArrow label="Wins" placement="top">
          W
        </Tooltip>
      ),
      Footer: (): number =>
        React.useMemo(() => summaryData?.stat?.wins ?? null, []),
    },
    {
      accessor: (row) => row.stat.losses,
      id: "losses",
      Header: () => (
        <Tooltip closeOnClick={false} hasArrow label="Losses" placement="top">
          L
        </Tooltip>
      ),
      Footer: (): number =>
        React.useMemo(() => summaryData?.stat?.losses ?? null, []),
    },
    {
      accessor: (row) => row.stat.win_pct,
      id: "winningPercentage",
      Header: () => (
        <Tooltip
          closeOnClick={false}
          hasArrow
          label="Winning Percentage"
          placement="top"
        >
          W-L%
        </Tooltip>
      ),
      Footer: (): number =>
        React.useMemo(() => summaryData?.stat?.win_pct ?? null, []),
      Cell: ({ value }: Cell<StatSplit>) => Number(value).toFixed(2),
      sortType: "basic",
    },
    {
      accessor: (row) => row.stat.earned_run_average,
      id: "earnedRunAverage",
      Header: () => (
        <Tooltip
          closeOnClick={false}
          hasArrow
          label="Earned Run Average"
          placement="top"
        >
          ERA
        </Tooltip>
      ),
      Footer: (): number =>
        React.useMemo(() => summaryData?.stat?.earned_run_average ?? null, []),
      Cell: ({ value }: Cell<StatSplit>) => Number(value).toFixed(2),
      sortType: "basic",
    },
    {
      accessor: (row) => row.stat.games,
      id: "gamesPlayed",
      Header: () => (
        <Tooltip
          closeOnClick={false}
          hasArrow
          label="Games Played"
          placement="top"
        >
          G
        </Tooltip>
      ),
      Footer: (): number =>
        React.useMemo(() => summaryData?.stat?.games ?? null, []),
    },
    {
      accessor: (row) => row.stat.shutouts,
      id: "shutouts",
      Header: () => (
        <Tooltip closeOnClick={false} hasArrow label="Shutouts" placement="top">
          SHO
        </Tooltip>
      ),
      Footer: (): number =>
        React.useMemo(() => summaryData?.stat?.shutouts ?? null, []),
    },
    {
      accessor: (row) => row.stat.innings,
      id: "inningsPitched",
      Header: () => (
        <Tooltip
          closeOnClick={false}
          hasArrow
          label="Innings Pitched"
          placement="top"
        >
          IP
        </Tooltip>
      ),
      Cell: ({ value }: Cell<StatSplit>) => Number(value).toFixed(1),
      Footer: (): number =>
        React.useMemo(() => summaryData?.stat?.innings ?? null, []),
      sortType: "basic",
    },
    {
      accessor: (row) => row.stat.hits_allowed,
      id: "hitsAllowed",
      Header: () => (
        <Tooltip
          closeOnClick={false}
          hasArrow
          label="Hits Allowed"
          placement="top"
        >
          H
        </Tooltip>
      ),
      Footer: (): number =>
        React.useMemo(() => summaryData?.stat?.hits_allowed ?? null, []),
    },
    {
      accessor: (row) => row.stat.runs_allowed,
      id: "earnedRuns",
      Header: () => (
        <Tooltip
          closeOnClick={false}
          hasArrow
          label="Earned Runs"
          placement="top"
        >
          R
        </Tooltip>
      ),
      Footer: (): number =>
        React.useMemo(() => summaryData?.stat?.runs_allowed ?? null, []),
    },
    {
      accessor: (row) => row.stat.home_runs_allowed,
      id: "homeRuns",
      Header: () => (
        <Tooltip
          closeOnClick={false}
          hasArrow
          label="Home Runs"
          placement="top"
        >
          HR
        </Tooltip>
      ),
      Footer: (): number =>
        React.useMemo(() => summaryData?.stat?.home_runs_allowed ?? null, []),
    },
    {
      accessor: (row) => row.stat.walks,
      id: "basesOnBalls",
      Header: () => (
        <Tooltip
          closeOnClick={false}
          hasArrow
          label="Bases on Balls (Walks)"
          placement="top"
        >
          BB
        </Tooltip>
      ),
      Footer: (): number =>
        React.useMemo(() => summaryData?.stat?.walks ?? null, []),
    },
    {
      accessor: (row) => row.stat.strikeouts,
      id: "strikeouts",
      Header: () => (
        <Tooltip
          closeOnClick={false}
          hasArrow
          label="Strikeouts"
          placement="top"
        >
          SO
        </Tooltip>
      ),
      Footer: (): number =>
        React.useMemo(() => summaryData?.stat?.strikeouts ?? null, []),
    },
    {
      accessor: (row) => row.stat.quality_starts,
      id: "qualityStarts",
      Header: () => (
        <Tooltip
          closeOnClick={false}
          hasArrow
          label="Quality Starts"
          placement="top"
        >
          QS
        </Tooltip>
      ),
      Footer: (): number =>
        React.useMemo(() => summaryData?.stat?.quality_starts ?? null, []),
    },
    {
      accessor: (row) => row.stat.batters_faced,
      id: "battersFaced",
      Header: () => (
        <Tooltip
          closeOnClick={false}
          hasArrow
          label="Batters Faced"
          placement="top"
        >
          BF
        </Tooltip>
      ),
      Footer: (): number =>
        React.useMemo(() => summaryData?.stat?.batters_faced ?? null, []),
    },
    {
      accessor: (row) => row.stat.whip,
      id: "walksAndHitsPerInningPitched",
      Header: () => (
        <Tooltip
          closeOnClick={false}
          hasArrow
          label="Walks and Hits Per Inning Pitched"
          placement="top"
        >
          WHIP
        </Tooltip>
      ),
      Footer: (): number =>
        React.useMemo(() => summaryData?.stat?.whip ?? null, []),
      Cell: ({ value }: Cell<StatSplit>) => Number(value).toFixed(3),
      sortType: "basic",
    },
    {
      accessor: (row) => row.stat.hits_per_9,
      id: "hitsAllowedPerNine",
      Header: () => (
        <Tooltip
          closeOnClick={false}
          hasArrow
          label="Hits Per 9 Innings"
          placement="top"
        >
          H9
        </Tooltip>
      ),
      Footer: (): number =>
        React.useMemo(() => summaryData?.stat?.hits_per_9 ?? null, []),
      Cell: ({ value }: Cell<StatSplit>) => Number(value).toFixed(1),
      sortType: "basic",
    },
    {
      accessor: (row) => row.stat.home_runs_per_9,
      id: "homeRunsPerNine",
      Header: () => (
        <Tooltip
          closeOnClick={false}
          hasArrow
          label="Home Runs Per 9 Innings"
          placement="top"
        >
          HR9
        </Tooltip>
      ),
      Footer: (): number =>
        React.useMemo(() => summaryData?.stat?.home_runs_per_9 ?? null, []),
      Cell: ({ value }: Cell<StatSplit>) => Number(value).toFixed(1),
      sortType: "basic",
    },
    {
      accessor: (row) => row.stat.walks_per_9,
      id: "basesOnBallsPerNine",
      Header: () => (
        <Tooltip
          closeOnClick={false}
          hasArrow
          label="Walks Per 9 Innings"
          placement="top"
        >
          BB9
        </Tooltip>
      ),
      Footer: (): number =>
        React.useMemo(() => summaryData?.stat?.walks_per_9 ?? null, []),
      Cell: ({ value }: Cell<StatSplit>) => Number(value).toFixed(1),
      sortType: "basic",
    },
    {
      accessor: (row) => row.stat.strikeouts_per_9,
      id: "strikeoutsPerNine",
      Header: () => (
        <Tooltip
          closeOnClick={false}
          hasArrow
          label="Strikeouts Per 9 Innings"
          placement="top"
        >
          SO9
        </Tooltip>
      ),
      Footer: (): number =>
        React.useMemo(() => summaryData?.stat?.strikeouts_per_9 ?? null, []),
      Cell: ({ value }: Cell<StatSplit>) => Number(value).toFixed(1),
      sortType: "basic",
    },
    {
      accessor: (row) => row.stat.strikeouts_per_walk,
      id: "strikeoutToWalkRatio",
      Header: () => (
        <Tooltip
          closeOnClick={false}
          hasArrow
          label="Strikeout-to-Walk Ratio"
          placement="top"
        >
          SO/BB
        </Tooltip>
      ),
      Footer: (): number =>
        React.useMemo(() => summaryData?.stat?.strikeouts_per_walk ?? null, []),
      Cell: ({ value }: Cell<StatSplit>) => Number(value).toFixed(2),
      sortType: "basic",
    },
  ];
}
