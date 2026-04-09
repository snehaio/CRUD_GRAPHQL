import { useState } from "react";
import "./App.css";
import { useQuery, useMutation, gql } from "@apollo/client";

const GET_USERS = gql`
  query GetUsers {
    getUsers {
      id
      age
      name
      isMarried
    }
  }
`;

const GET_USER_BY_ID = gql`
  query GetUserById($id: ID!) {
    getUserById(id: $id) {
      id
      age
      name
      isMarried
    }
  }
`;

const CREATE_USER = gql`
  mutation CreateUser($name: String!, $age: Int!, $isMarried: Boolean!) {
    createUser(name: $name, age: $age, isMarried: $isMarried) {
      name
    }
  }
`;

function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const AVATAR_COLORS = [
  { bg: "#E6F1FB", color: "#185FA5" },
  { bg: "#E1F5EE", color: "#0F6E56" },
  { bg: "#FAEEDA", color: "#854F0B" },
  { bg: "#FBEAF0", color: "#993556" },
  { bg: "#EEEDFE", color: "#534AB7" },
];

function getAvatarColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

function UserCard({ user, onSelect }) {
  const avatarColor = getAvatarColor(user.name);
  return (
    <div
      onClick={() => onSelect(user.id)}
      style={{
        background: "var(--color-background-primary)",
        border: "0.5px solid var(--color-border-tertiary)",
        borderRadius: "var(--border-radius-lg)",
        padding: "1rem 1.25rem",
        cursor: "pointer",
        transition: "border-color 0.15s",
        display: "flex",
        alignItems: "center",
        gap: "12px",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.borderColor = "var(--color-border-secondary)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.borderColor = "var(--color-border-tertiary)")
      }
    >
      <div
        style={{
          width: "42px",
          height: "42px",
          borderRadius: "50%",
          background: avatarColor.bg,
          color: avatarColor.color,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: "500",
          fontSize: "14px",
          flexShrink: 0,
        }}
      >
        {getInitials(user.name)}
      </div>
      <div style={{ flex: 1 }}>
        <p
          style={{
            margin: 0,
            fontWeight: "500",
            fontSize: "15px",
            color: "var(--color-text-primary)",
          }}
        >
          {user.name}
        </p>
        <p
          style={{
            margin: 0,
            fontSize: "13px",
            color: "var(--color-text-secondary)",
          }}
        >
          Age {user.age}
        </p>
      </div>
      <span
        style={{
          fontSize: "12px",
          padding: "3px 10px",
          borderRadius: "999px",
          background: user.isMarried ? "#E1F5EE" : "#F1EFE8",
          color: user.isMarried ? "#0F6E56" : "#5F5E5A",
          fontWeight: "500",
        }}
      >
        {user.isMarried ? "Married" : "Single"}
      </span>
    </div>
  );
}

function App() {
  const [newUser, setNewUser] = useState({ name: "", age: "", isMarried: false });
  const [selectedId, setSelectedId] = useState("1");
  const [toast, setToast] = useState(null);
  const [search, setSearch] = useState("");

  const { data: getUsersData, error: getUsersError, loading: getUsersLoading } =
    useQuery(GET_USERS);

  const { data: getUserByIdData, loading: getUserByIdLoading } = useQuery(
    GET_USER_BY_ID,
    { variables: { id: selectedId } }
  );

  const [createUser, { loading: createLoading }] = useMutation(CREATE_USER, {
    refetchQueries: [{ query: GET_USERS }],
  });

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  if (getUsersLoading)
    return (
      <div style={{ padding: "3rem", textAlign: "center", color: "var(--color-text-secondary)" }}>
        Loading...
      </div>
    );

  if (getUsersError)
    return (
      <div style={{ padding: "3rem", textAlign: "center", color: "var(--color-text-danger)" }}>
        Error: {getUsersError.message}
      </div>
    );

  const handleCreateUser = async () => {
    if (!newUser.name.trim() || !newUser.age) {
      showToast("Please fill in name and age.", "error");
      return;
    }
    try {
      await createUser({
        variables: {
          name: newUser.name.trim(),
          age: Number(newUser.age),
          isMarried: newUser.isMarried,
        },
      });
      setNewUser({ name: "", age: "", isMarried: false });
      showToast(`${newUser.name} created successfully!`);
    } catch (err) {
      showToast("Failed to create user.", "error");
    }
  };

  const filteredUsers = (getUsersData?.getUsers || []).filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  const chosenUser = getUserByIdData?.getUserById;
  const chosenColor = chosenUser ? getAvatarColor(chosenUser.name) : null;

  return (
    <div
      style={{
        maxWidth: "720px",
        margin: "0 auto",
        padding: "2rem 1rem",
        fontFamily: "var(--font-sans)",
      }}
    >
      {/* Toast */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: "1.5rem",
            right: "1.5rem",
            background:
              toast.type === "error"
                ? "var(--color-background-danger)"
                : "var(--color-background-success)",
            color:
              toast.type === "error"
                ? "var(--color-text-danger)"
                : "var(--color-text-success)",
            border: `0.5px solid ${
              toast.type === "error"
                ? "var(--color-border-danger)"
                : "var(--color-border-success)"
            }`,
            borderRadius: "var(--border-radius-md)",
            padding: "0.75rem 1.25rem",
            fontSize: "14px",
            zIndex: 999,
          }}
        >
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            fontSize: "22px",
            fontWeight: "500",
            margin: "0 0 4px",
            color: "var(--color-text-primary)",
          }}
        >
          User manager
        </h1>
        <p style={{ margin: 0, fontSize: "14px", color: "var(--color-text-secondary)" }}>
          {getUsersData.getUsers.length} users total
        </p>
      </div>

      {/* Create user form */}
      <div
        style={{
          background: "var(--color-background-primary)",
          border: "0.5px solid var(--color-border-tertiary)",
          borderRadius: "var(--border-radius-lg)",
          padding: "1.25rem",
          marginBottom: "1.5rem",
        }}
      >
        <p
          style={{
            margin: "0 0 12px",
            fontSize: "13px",
            fontWeight: "500",
            color: "var(--color-text-secondary)",
            textTransform: "uppercase",
            letterSpacing: "0.05em",
          }}
        >
          Add new user
        </p>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <input
            placeholder="Full name"
            value={newUser.name}
            onChange={(e) => setNewUser((p) => ({ ...p, name: e.target.value }))}
            style={{ flex: "2", minWidth: "140px" }}
          />
          <input
            placeholder="Age"
            type="number"
            value={newUser.age}
            onChange={(e) => setNewUser((p) => ({ ...p, age: e.target.value }))}
            style={{ flex: "1", minWidth: "80px" }}
          />
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "14px",
              color: "var(--color-text-secondary)",
              cursor: "pointer",
              padding: "0 4px",
            }}
          >
            <input
              type="checkbox"
              checked={newUser.isMarried}
              onChange={(e) => setNewUser((p) => ({ ...p, isMarried: e.target.checked }))}
            />
            Married
          </label>
          <button
            onClick={handleCreateUser}
            disabled={createLoading}
            style={{ whiteSpace: "nowrap" }}
          >
            {createLoading ? "Creating..." : "Create user"}
          </button>
        </div>
      </div>

      {/* Chosen user */}
      <div
        style={{
          background: "var(--color-background-primary)",
          border: "0.5px solid var(--color-border-tertiary)",
          borderRadius: "var(--border-radius-lg)",
          padding: "1.25rem",
          marginBottom: "1.5rem",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "12px",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "13px",
              fontWeight: "500",
              color: "var(--color-text-secondary)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            Lookup user by ID
          </p>
          <input
            placeholder="User ID"
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            style={{ width: "100px" }}
          />
        </div>

        {getUserByIdLoading ? (
          <p style={{ margin: 0, fontSize: "14px", color: "var(--color-text-secondary)" }}>
            Loading...
          </p>
        ) : chosenUser ? (
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: chosenColor.bg,
                color: chosenColor.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "500",
                fontSize: "15px",
                flexShrink: 0,
              }}
            >
              {getInitials(chosenUser.name)}
            </div>
            <div>
              <p style={{ margin: 0, fontWeight: "500", color: "var(--color-text-primary)" }}>
                {chosenUser.name}
              </p>
              <p style={{ margin: 0, fontSize: "13px", color: "var(--color-text-secondary)" }}>
                Age {chosenUser.age} &middot;{" "}
                {chosenUser.isMarried ? "Married" : "Single"}
              </p>
            </div>
          </div>
        ) : (
          <p style={{ margin: 0, fontSize: "14px", color: "var(--color-text-secondary)" }}>
            No user found with ID "{selectedId}"
          </p>
        )}
      </div>

      {/* Users list */}
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "12px",
          }}
        >
          <p
            style={{
              margin: 0,
              fontSize: "13px",
              fontWeight: "500",
              color: "var(--color-text-secondary)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            All users
          </p>
          <input
            placeholder="Search by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "180px" }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {filteredUsers.length === 0 ? (
            <p style={{ fontSize: "14px", color: "var(--color-text-secondary)" }}>
              No users found.
            </p>
          ) : (
            filteredUsers.map((user) => (
              <UserCard key={user.id} user={user} onSelect={setSelectedId} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;