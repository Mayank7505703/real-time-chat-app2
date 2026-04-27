import {
  Box, Flex, Spinner, Text, VStack, Heading, Button, Icon, 
  useColorModeValue, useDisclosure, Modal, ModalOverlay, 
  ModalContent, ModalHeader, ModalCloseButton, ModalBody
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FiUsers, FiSearch } from "react-icons/fi";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";
import SuggestedUsers from "../components/SuggestedUsers";
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";

const HomePage = () => {
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [loading, setLoading] = useState(true);
  const showToast = useShowToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const cardBg = useColorModeValue("white", "gray.900");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const sideBg = useColorModeValue("white", "gray.900");
  const heroBg = useColorModeValue("gray.50", "gray.800");

  useEffect(() => {
    const getFeedPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/posts/feed");
        const data = await res.json();
        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        setPosts(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
    };
    getFeedPosts();
  }, [showToast, setPosts]);

  // DIAGNOSTIC FUNCTION
  const handleExplore = () => {
    console.log("Button clicked!");
    const sidebar = document.getElementById("suggested-users-sidebar");
    
    // Check screen width
    const width = window.innerWidth;
    console.log("Current Screen Width:", width);

    if (width < 992) {
      console.log("Mobile detected: Opening Modal...");
      onOpen();
    } else {
      console.log("Desktop detected: Looking for sidebar...");
      if (sidebar) {
        console.log("Sidebar found! Scrolling...");
        sidebar.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        console.error("ERROR: Could not find element with ID 'suggested-users-sidebar'");
        showToast("Error", "Sidebar element not found in DOM", "error");
      }
    }
  };

  return (
    <Flex gap={6} alignItems="flex-start" maxW="1200px" mx="auto" px={4} py={6}>
      <Box flex={70}>
        <Box bg={heroBg} p={6} rounded="2xl" border="1px solid" borderColor={borderColor} mb={6}>
          <Heading size="lg" mb={2}>Welcome Back 👋</Heading>
          <Text color="gray.500">See what people are sharing today.</Text>
        </Box>

        {loading && (
          <Flex justify="center" py={10}><Spinner size="xl" /></Flex>
        )}

        {!loading && posts.length === 0 && (
          <Box bg={cardBg} p={10} rounded="2xl" border="1px solid" borderColor={borderColor} textAlign="center">
            <VStack spacing={4}>
              <Icon as={FiUsers} boxSize={10} color="blue.400" />
              <Heading size="md">Your feed is empty</Heading>
              <Text color="gray.500">Follow users to discover posts and updates.</Text>
              <Button leftIcon={<FiSearch />} colorScheme="blue" rounded="full" onClick={handleExplore}>
                Explore Users
              </Button>
            </VStack>
          </Box>
        )}

        <VStack spacing={5} align="stretch">
          {!loading && posts.map((post) => (
            <Box key={post._id} bg={cardBg} p={4} rounded="2xl" border="1px solid" borderColor={borderColor}>
              <Post post={post} postedBy={post.postedBy} />
            </Box>
          ))}
        </VStack>
      </Box>

      {/* Sidebar - MAKE SURE THE ID MATCHES EXACTLY */}
      <Box 
        id="suggested-users-sidebar" 
        flex={30} 
        display={{ base: "none", lg: "block" }} 
        position="sticky" 
        top="90px"
      >
        <Box bg={sideBg} p={5} rounded="2xl" border="1px solid" borderColor={borderColor} shadow="sm">
          <SuggestedUsers />
        </Box>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} size="sm" isCentered>
        <ModalOverlay backdropFilter="blur(8px)" />
        <ModalContent bg={sideBg} rounded="xl">
          <ModalHeader>Suggested Users</ModalHeader>
          <ModalCloseButton />
          <ModalBody py={6}>
            <SuggestedUsers />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default HomePage;