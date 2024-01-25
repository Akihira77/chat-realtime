import React from "react";
import {
	ConversationSidebarContainer,
	ConversationSidebarHeader,
	ConversationSidebarItem,
	ConversationSidebarStyle,
} from "../../utils/styles/index.tsx";
import { TbEdit } from "react-icons/tb";
import { Contact } from "../../utils/types.ts";
import styles from "./index.module.scss";
import { useNavigate } from "react-router-dom";
import CreateConversationModal from "../modals/CreateConversationModal.tsx";
import { AuthContext } from "../../utils/context/AuthContext.tsx";
import { RandomizeAvatar } from "../../__mocks__/avatars.ts";

type Props = {
	users: Contact[];
	setUserId: React.Dispatch<React.SetStateAction<string | undefined>>;
};

const ConversationSidebar: React.FC<Props> = ({ users, setUserId }) => {
	const navigate = useNavigate();
	const { user } = React.useContext(AuthContext);
	const [showModal, setShowModal] = React.useState(false);
	const avatar = RandomizeAvatar();

	const handleLogout = () => {
		document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTS; path=/;`;

		navigate("/login");
	};

	return (
		<>
			{showModal && (
				<CreateConversationModal setShowModal={setShowModal} />
			)}
			<ConversationSidebarStyle>
				<ConversationSidebarHeader>
					<div className="identity">
						<div className="heading-avatar-icon">
							<img src={avatar.src} alt={avatar.alt} />
						</div>
						<h3>{user?.fullName}</h3>
					</div>
					<div className={styles.heading_menu}>
						{/* <div
							className="heading-modal"
							onClick={() => setShowModal(!showModal)}
						>
							<TbEdit size={32} />
						</div> */}
						<div className={`${styles.heading_dot} dropdown`}>
							<button
								className={`${styles.dropdown_toggle} dropdown-toggle`}
								type="button"
								data-bs-toggle="dropdown"
								aria-expanded="false"
							>
								<i
									className={`fa fa-ellipsis-v fa-2x pull-right`}
									aria-hidden="true"
								></i>
							</button>
							<ul className="dropdown-menu">
								<li>
									<button
										className="dropdown-item"
										onClick={handleLogout}
									>
										Log Out
									</button>
								</li>
							</ul>
						</div>
					</div>
				</ConversationSidebarHeader>
				<ConversationSidebarContainer>
					{users.map(({ user, unread }) => (
						<ConversationSidebarItem
							key={user.id}
							onClick={() =>
								// navigate(`/conversations/${user.id}`)
								setUserId(user.id)
							}
						>
							<div className={styles.conversationAvatar}>
								<img
									src={RandomizeAvatar().src}
									alt={RandomizeAvatar().alt}
								/>
							</div>
							<div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
								<span className={styles.conversationName}>
									{user.fullName}
								</span>
								{unread > 0 && <span>{unread}</span>}
							</div>
						</ConversationSidebarItem>
					))}
				</ConversationSidebarContainer>
			</ConversationSidebarStyle>
		</>
	);
};

export default ConversationSidebar;
