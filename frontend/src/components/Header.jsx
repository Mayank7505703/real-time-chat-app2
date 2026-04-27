import { Flex, Box, IconButton, Text, useColorModeValue, HStack, Tooltip, Container, Avatar } from "@chakra-ui/react";
import { FiHome, FiMessageCircle, FiSettings, FiLogOut, FiPlusSquare, FiUser } from "react-icons/fi"; // Added FiUser
import { AtSignIcon } from "@chakra-ui/icons";
import { Link, useLocation } from "react-router-dom";
import { useSetRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import createPostModalAtom from "../atoms/modalAtom";
import useShowToast from "../hooks/useShowToast";

const Header = () => {
  const setUser = useSetRecoilState(userAtom);
  const user = useRecoilValue(userAtom);
  const setOpen = useSetRecoilState(createPostModalAtom);
  const { pathname } = useLocation();

  const bg = useColorModeValue("rgba(255, 255, 255, 0.8)", "rgba(18, 18, 18, 0.8)");
  const borderColor = useColorModeValue("gray.200", "whiteAlpha.200");
  const activeColor = "blue.400";

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/users/logout", { method: "POST" });
      const data = await res.json();
      if (data.error) { showToast("Error", data.error, "error"); return; }
      localStorage.removeItem("user-threads");
      setUser(null);
    } catch (error) { showToast("Error", error.message, "error"); }
  };

  return (
    <Box position="sticky" top="0" zIndex="1000" backdropFilter="blur(15px)" bg={bg} borderBottom="1px solid" borderColor={borderColor}>
      <Container maxW="container.lg" px={4}>
        <Flex h="70px" align="center" justify="space-between">
          {/* Logo */}
          <Link to="/">
            <HStack spacing={2} _hover={{ opacity: 0.8 }}>
              <Box bgGradient="linear(to-br, blue.400, purple.600)" p={1.5} rounded="lg">
                <AtSignIcon color="white" />
              </Box>
              <Text fontSize="xl" fontWeight="800" bgGradient="linear(to-r, blue.400, purple.500)" bgClip="text" display={{ base: "none", md: "block" }}>
                ThreadHub
              </Text>
            </HStack>
          </Link>

          {/* Navigation */}
          <HStack spacing={{ base: 1, md: 4 }}>
            <Tooltip label="Home">
              <Link to="/">
                <IconButton icon={<FiHome />} variant="ghost" rounded="xl" fontSize="22px" color={pathname === "/" ? activeColor : "inherit"} />
              </Link>
            </Tooltip>
            
            {user && (
              <Tooltip label="Create Post">
                <IconButton icon={<FiPlusSquare />} variant="ghost" rounded="xl" fontSize="22px" onClick={() => setOpen(true)} />
              </Tooltip>
            )}

            {/* PROFILE BUTTON: Links to your specific username */}
            {user && (
              <Tooltip label="Profile">
                <Link to={`/${user.username}`}>
                  <IconButton 
                    icon={<FiUser />} 
                    variant="ghost" 
                    rounded="xl" 
                    fontSize="22px" 
                    color={pathname === `/${user.username}` ? activeColor : "inherit"} 
                  />
                </Link>
              </Tooltip>
            )}

            <Tooltip label="Messages">
              <Link to="/chat">
                <IconButton icon={<FiMessageCircle />} variant="ghost" rounded="xl" fontSize="22px" color={pathname === "/chat" ? activeColor : "inherit"} />
              </Link>
            </Tooltip>

            <Tooltip label="Settings">
              <Link to="/settings">
                <IconButton icon={<FiSettings />} variant="ghost" rounded="xl" fontSize="22px" color={pathname === "/settings" ? activeColor : "inherit"} />
              </Link>
            </Tooltip>
            
            {user && (
              <>
                <Box w="1px" h="20px" bg={borderColor} mx={2} />
                <Tooltip label="Logout">
                  <IconButton icon={<FiLogOut />} variant="ghost" rounded="xl" fontSize="22px" colorScheme="red" onClick={handleLogout} />
                </Tooltip>
              </>
            )}
          </HStack>
        </Flex>
      </Container>
    </Box>
  );
};

export default Header;