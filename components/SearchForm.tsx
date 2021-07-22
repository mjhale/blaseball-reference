import { getColor } from "@chakra-ui/theme-tools";
import * as React from "react";
import styled from "@emotion/styled";
import useAlgoliaSearchResults from "hooks/useAlgoliaSearchResults";
import { useColorModeValue } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useTheme } from "@chakra-ui/react";

import SearchRecord from "types/searchRecord";

import {
  Combobox,
  ComboboxInput as ReachComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
} from "@reach/combobox";
import {
  Box,
  Button,
  CircularProgress,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Link,
  List,
  ListItem,
  Skeleton,
  VisuallyHidden,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";

// @TODO: Fix combobox options rendering after submit when already on search page
export default function SearchForm() {
  const [hasSelected, setHasSelected] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [{ isLoading, results }, setSearchTerm] = useAlgoliaSearchResults();
  const resultComboboxOptionData = React.useRef<{
    [name: string]: SearchRecord;
  }>({});
  const router = useRouter();
  const theme = useTheme();

  // @TODO: Remove workarounds for Chakra / Combobox typing conflicts
  const ComboboxInput = ReachComboboxInput;

  const StyledComboboxOption = styled(ComboboxOption)`
    [data-user-value] {
      font-weight: ${theme.fontWeights.bold};
    }
  `;

  function handleChange(evt: React.FormEvent<HTMLInputElement>): void {
    evt.preventDefault();

    const value = evt.currentTarget.value;
    setInputValue(value);

    if (value.length >= 2) {
      setSearchTerm(value);
    }
  }

  function handleSelect(selectedItem: string): void {
    setInputValue(selectedItem);
    setHasSelected(true);

    // Redirect user to selected term's anchor
    if (resultComboboxOptionData.current[selectedItem].type === "players") {
      router.push(
        "/players/[playerSlug]",
        resultComboboxOptionData.current[selectedItem].anchor
      );
    } else if (
      resultComboboxOptionData.current[selectedItem].type === "teams"
    ) {
      router.push(
        "/teams/[teamSlug]",
        resultComboboxOptionData.current[selectedItem].anchor
      );
    }
  }

  // @TODO: Change focus to search result body on submit
  function handleSubmit(evt: React.SyntheticEvent): void {
    evt.preventDefault();
    setSearchTerm("");

    // If on search page, use shallow routing to avoid re-running data fetching methods
    if (router.pathname === "/search") {
      router.push(`/search?searchTerm=${inputValue}`, undefined, {
        shallow: true,
      });
    } else {
      router.push(`/search?searchTerm=${inputValue}`);
    }
  }

  // Insert term into input when component is being rendered on search page
  React.useEffect(() => {
    if (router.pathname === "/search" && router.query?.searchTerm) {
      setInputValue(String(router.query.searchTerm));
    }
  }, [router.pathname, router.query.searchTerm]);

  // Reset loading icon on page transitions
  React.useEffect(() => {
    const resetHasSelected = () => {
      if (hasSelected) {
        setInputValue("");
        setHasSelected(false);
      }
    };

    router.events.on("routeChangeComplete", resetHasSelected);

    return () => {
      router.events.off("routeChangeComplete", resetHasSelected);
    };
  }, [hasSelected, router.events]);

  const iconColor = useColorModeValue("gray.400", "gray.500");
  const comboListBackgroundColor = useColorModeValue("white", "gray.800");
  const comboListBorderColor = useColorModeValue("gray.200", "gray.500");
  const comboListHeadingBackgroundColor = useColorModeValue(
    "gray.100",
    "gray.700"
  );
  const comboListItemHoverBackgroundColor = useColorModeValue(
    "hsl(35, 100%, 95%)",
    "gray.500"
  );
  const comboListItemSelectBackgroundColor = useColorModeValue(
    "hsl(35, 100%, 85%)",
    "gray.600"
  );

  return (
    <Box width="100%">
      <form onSubmit={handleSubmit}>
        <Flex alignItems="center" direction="row" wrap="nowrap">
          <Combobox as={Box} mr={2} onSelect={handleSelect} width="100%">
            <FormControl id="searchTerm">
              <VisuallyHidden as={FormLabel}>
                Search Blaseball Reference
              </VisuallyHidden>

              <InputGroup>
                <InputLeftElement>
                  {isLoading ? (
                    <CircularProgress
                      color={iconColor}
                      isIndeterminate
                      size={5}
                    />
                  ) : (
                    <SearchIcon color={iconColor} fontSize="xl" />
                  )}
                </InputLeftElement>

                <Input
                  _focus={{
                    border: "1px solid",
                    borderColor: useColorModeValue("blue.200", "blue.500"),
                    boxShadow: `0 0 0 4px ${useColorModeValue(
                      getColor(theme, "blue.50"),
                      getColor(theme, "blue.600")
                    )}`,
                    outline: "none",
                  }}
                  _placeholder={{
                    color: useColorModeValue("gray.400", "gray.600"),
                  }}
                  as={ComboboxInput}
                  borderColor={useColorModeValue("gray.200", "gray.500")}
                  fontSize={{ base: "lg", md: "md" }}
                  id="searchTerm"
                  inputMode="search"
                  name="searchTerm"
                  onChange={handleChange}
                  placeholder="Search players and teams"
                  selectOnClick={true}
                  value={inputValue}
                />
              </InputGroup>
            </FormControl>

            {isLoading || Object.keys(results).length > 0 ? (
              <ComboboxPopover
                portal={false}
                style={{ position: "relative", zIndex: 20 }}
              >
                <ComboboxList
                  as={List}
                  bgColor={comboListBackgroundColor}
                  border="1px solid"
                  borderColor={comboListBorderColor}
                  borderRadius="md"
                  boxShadow="sm"
                  position="absolute"
                  maxHeight={96}
                  mt={2}
                  overflowY="scroll"
                  top="0"
                  width="full"
                >
                  <>
                    {isLoading ? (
                      <>
                        <Heading
                          as="h3"
                          bgColor={comboListHeadingBackgroundColor}
                          py={2}
                          px={4}
                          size="sm"
                        >
                          <Skeleton
                            startColor="gray.500"
                            endColor="black"
                            height={4}
                            width={16}
                          />
                        </Heading>
                        <ListItem px={3} py={1}>
                          <Skeleton>Loading...</Skeleton>
                        </ListItem>
                      </>
                    ) : (
                      <>
                        {Object.keys(results).map((resultGroup) => {
                          return (
                            <React.Fragment key={resultGroup}>
                              <Heading
                                as="h3"
                                bgColor={comboListHeadingBackgroundColor}
                                py={2}
                                px={4}
                                size="sm"
                                textTransform="capitalize"
                              >
                                {resultGroup}
                              </Heading>
                              <Box>
                                {results[resultGroup].map((result) => {
                                  resultComboboxOptionData.current[
                                    result.title
                                  ] = {
                                    ...result,
                                  };

                                  return (
                                    <ListItem
                                      _hover={{
                                        bgColor:
                                          comboListItemHoverBackgroundColor,
                                      }}
                                      _selected={{
                                        bgColor:
                                          comboListItemSelectBackgroundColor,
                                      }}
                                      as={StyledComboboxOption}
                                      cursor="pointer"
                                      fontSize="sm"
                                      key={result.objectID}
                                      px={3}
                                      py={1}
                                      value={result.title}
                                    />
                                  );
                                })}
                              </Box>
                            </React.Fragment>
                          );
                        })}
                      </>
                    )}
                    <Flex
                      bgColor={comboListHeadingBackgroundColor}
                      justifyContent="center"
                    >
                      <Link
                        display="inlineBlock"
                        href="https://algolia.com"
                        isExternal
                        tabIndex={-1}
                      >
                        <Image
                          alt="Search by Algolia"
                          height="16px"
                          mb={2}
                          mt={2}
                          src="/search-by-algolia.svg"
                        />
                      </Link>
                    </Flex>
                  </>
                </ComboboxList>
              </ComboboxPopover>
            ) : null}
          </Combobox>

          <Button isLoading={hasSelected} type="submit">
            Search
          </Button>
        </Flex>
      </form>
    </Box>
  );
}
