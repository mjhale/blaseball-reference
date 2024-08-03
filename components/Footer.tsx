import {
  Box,
  Container,
  Flex,
  Image,
  Link,
  List,
  ListItem,
  Text,
} from "@chakra-ui/react";
import NextLink from "next/link";

export default function Footer() {
  return (
    <Container maxWidth="6xl">
      <Box
        as="footer"
        fontSize="sm"
        my={{ base: 8, md: 10 }}
        textAlign="center"
      >
        <Box mb={2}>
          <List>
            <ListItem display="inline">
              <Link
                href="https://twitter.com/blaseball_ref"
                isExternal
                textDecoration="underline"
              >
                Twitter
              </Link>
            </ListItem>
            <ListItem display="inline" ml={1}>
              -
            </ListItem>
            <ListItem display="inline" ml={1}>
              <Link
                href="https://github.com/mjhale/blaseball-reference.com"
                isExternal
                textDecoration="underline"
              >
                GitHub
              </Link>
            </ListItem>
            <ListItem display="inline" ml={1}>
              -
            </ListItem>
            <ListItem display="inline" ml={1}>
              <Link
                href="https://blaseball.com"
                isExternal
                textDecoration="underline"
              >
                Blaseball
              </Link>
            </ListItem>
            <ListItem display="inline" ml={1}>
              -
            </ListItem>
            <ListItem display="inline" ml={1}>
              <Link
                href="https://sibr.dev"
                isExternal
                textDecoration="underline"
              >
                SIBR
              </Link>
            </ListItem>
            <ListItem display="inline" ml={1}>
              -
            </ListItem>
            <ListItem display="inline" ml={1}>
              <Link href="/privacy" as={NextLink} textDecoration="underline">
                Privacy
              </Link>
            </ListItem>
          </List>
        </Box>
        <Box>
          Blaseball Reference is neither endorsed by nor directly affiliated
          with{" "}
          <Link
            href="https://thegameband.com/"
            isExternal
            textDecoration="underline"
          >
            The Game Band
          </Link>
          <Text as="span"> or </Text>
          <Link
            href="https://www.sports-reference.com/"
            isExternal
            textDecoration="underline"
          >
            Sports Reference
          </Link>
          .
        </Box>
        <Flex alignItems="center" justifyContent="center" mt={4}>
          <Link
            display="block"
            href="https://vercel.com/?utm_source=blaseball-reference-com&utm_campaign=oss"
            isExternal
            rel="nofollow"
          >
            <Image
              alt="Powered by Vercel"
              height="100%"
              maxHeight="35px"
              src="/powered-by-vercel.svg"
            />
          </Link>
        </Flex>
      </Box>
    </Container>
  );
}
