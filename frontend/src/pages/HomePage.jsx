import {
	Box,
	Flex,
	Spinner,
	Text,
	VStack,
	Heading,
	Button,
	Icon,
	useColorModeValue,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FiUsers, FiRefreshCw } from "react-icons/fi";
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";
import SuggestedUsers from "../components/SuggestedUsers";

const HomePage = () => {
	const [posts, setPosts] = useRecoilState(postsAtom);
	const [loading, setLoading] = useState(true);
	const showToast = useShowToast();

	const cardBg = useColorModeValue("white", "gray.900");
	const borderColor = useColorModeValue("gray.200", "gray.700");
	const sideBg = useColorModeValue("white", "gray.900");
	const heroBg = useColorModeValue("gray.50", "gray.800");

	useEffect(() => {
		const getFeedPosts = async () => {
			setLoading(true);
			setPosts([]);
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

	return (
		<Flex
			gap={6}
			alignItems="flex-start"
			maxW="1200px"
			mx="auto"
			px={4}
			py={6}
		>
			{/* Feed Section */}
			<Box flex={70}>
				{/* Hero Header */}
				<Box
					bg={heroBg}
					p={6}
					rounded="2xl"
					border="1px solid"
					borderColor={borderColor}
					mb={6}
				>
					<Heading size="lg" mb={2}>
						Welcome Back 👋
					</Heading>
					<Text color="gray.500">
						See what people are sharing today.
					</Text>
				</Box>

				{/* Loading */}
				{loading && (
					<Flex justify="center" py={10}>
						<Spinner size="xl" thickness="4px" />
					</Flex>
				)}

				{/* Empty Feed */}
				{!loading && posts.length === 0 && (
					<Box
						bg={cardBg}
						p={10}
						rounded="2xl"
						border="1px solid"
						borderColor={borderColor}
						textAlign="center"
					>
						<VStack spacing={4}>
							<Icon as={FiUsers} boxSize={10} color="blue.400" />
							<Heading size="md">Your feed is empty</Heading>
							<Text color="gray.500">
								Follow users to discover posts and updates.
							</Text>
							<Button
								leftIcon={<FiRefreshCw />}
								colorScheme="blue"
								rounded="full"
							>
								Explore Users
							</Button>
						</VStack>
					</Box>
				)}

				{/* Posts */}
				<VStack spacing={5} align="stretch">
					{posts.map((post) => (
						<Box
							key={post._id}
							bg={cardBg}
							p={4}
							rounded="2xl"
							border="1px solid"
							borderColor={borderColor}
							shadow="sm"
							_hover={{
								transform: "translateY(-2px)",
								shadow: "md",
							}}
							transition="0.2s ease"
						>
							<Post post={post} postedBy={post.postedBy} />
						</Box>
					))}
				</VStack>
			</Box>

			{/* Sidebar */}
			<Box
				flex={30}
				display={{ base: "none", lg: "block" }}
				position="sticky"
				top="90px"
			>
				<Box
					bg={sideBg}
					p={5}
					rounded="2xl"
					border="1px solid"
					borderColor={borderColor}
					shadow="sm"
				>
					<Heading size="md" mb={4}>
						Suggested for You
					</Heading>
					<SuggestedUsers />
				</Box>
			</Box>
		</Flex>
	);
};

export default HomePage;