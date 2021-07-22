import apiFetcher, { dbApiFetcher } from "lib/api-fetcher";
import * as React from "react";

import Player from "types/player";
import { GetStaticProps } from "next";

import { Box, Heading, Text } from "@chakra-ui/react";
import CommaSeparatedPlayerList from "components/CommaSeparatedPlayerList";
import Head from "next/head";
import Layout from "components/Layout";
import UpcomingDates from "components/UpcomingDates";

function sortPlayersByDebut(players: Player[]): Player[] {
  const playersSortedByDebut: Player[] = Array.isArray(players)
    ? [...players].sort((a, b) => {
        const aDebutGame = a.debut_season * 1000 + a.debut_gameday;
        const bDebutGame = b.debut_season * 1000 + b.debut_gameday;

        return bDebutGame - aDebutGame;
      })
    : [];

  return playersSortedByDebut;
}

function sortPlayersByIncineration(players: Player[]): Player[] {
  const playersSortedByIncineration: Player[] = Array.isArray(players)
    ? [...players]
        .filter(
          (player) =>
            Number.isInteger(player.incineration_season) &&
            Number.isInteger(player.incineration_gameday)
        )
        .sort((a, b) => {
          const aIncinerationGame: number =
            a.incineration_season * 1000 + a.incineration_gameday;
          const bIncinerationGame: number =
            b.incineration_season * 1000 + b.incineration_gameday;

          return bIncinerationGame - aIncinerationGame;
        })
    : [];

  return playersSortedByIncineration;
}

type IndexPageProps = {
  players: Player[];
  seasonStartDates: Record<string, string>;
};

export default function IndexPage(props: IndexPageProps) {
  const { players, seasonStartDates } = props;

  // @TODO: Fallback if `players` doesn't exist
  const recentPlayerDebuts: Player[] = React.useMemo(
    () => sortPlayersByDebut(players).slice(0, 15),
    [players]
  );

  const recentPlayerIncinerations: Player[] = React.useMemo(
    () => sortPlayersByIncineration(players),
    [players]
  );

  return (
    <>
      <Head>
        <title>
          Blaseball Stats, Scores, History, and More - Blaseball-Reference.com
        </title>
        <meta
          property="og:title"
          content="Blaseball Stats, Scores, History, and More - Blaseball-Reference.com"
          key="og:title"
        />
        <meta
          name="description"
          property="og:description"
          content="The complete source for current and historical blaseball players,
            teams, scores, leaders, umps, blessings, and curses."
        />
      </Head>
      <Layout>
        <Box mb={4}>
          <Heading as="h1" mb={2} size="lg">
            Blaseball Stats, Scores, and History
          </Heading>
          <Text>
            The complete* source for current and historical blaseball players,
            teams, scores, leaders, umps, blessings, and curses.
          </Text>
        </Box>
        <Box mb={4}>
          <Heading as="h2" mb={2} size="md">
            Upcoming Dates
          </Heading>
          <UpcomingDates seasonStartDates={seasonStartDates} />
        </Box>
        <Box mb={4}>
          <Heading as="h2" mb={2} size="md">
            Recent Debuts
          </Heading>
          <CommaSeparatedPlayerList players={recentPlayerDebuts} />
        </Box>
        <Box mb={4}>
          <Heading as="h2" mb={2} size="md">
            In Memoriam
          </Heading>
          <CommaSeparatedPlayerList players={recentPlayerIncinerations} />
        </Box>
      </Layout>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  let players = null;
  let seasonStartDates = null;

  try {
    players = await dbApiFetcher("/players");
  } catch (error) {
    console.log(error);
  }

  try {
    seasonStartDates = await apiFetcher("/seasonStartDates.json");
  } catch (error) {
    console.log(error);
  }

  return {
    props: {
      players,
      seasonStartDates,
    },
    revalidate: 2700,
  };
};
