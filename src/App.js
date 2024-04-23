import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "رضا",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "مریم",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "مجید",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];
const Button = ({ children, onClick }) => {
  return (
    <>
      <button className="button" onClick={onClick}>
        {children}
      </button>
    </>
  );
};
const App = () => {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  const handleShowAddFriend = () => {
    // setShowAddFriend(!showAddFriend);
    setShowAddFriend((perv) => !perv);
  };

  const handleAddFriend = (friend) => {
    setFriends((friends) => [...friends, friend]);
    setShowAddFriend(false);
  };

  const handleSelection = (friend) => {
    // setSelectedFriend(friend);
    setSelectedFriend((prev) => (prev?.id === friend.id ? null : friend));
    setShowAddFriend(false);
  };

  const handleSplitBill = (value) => {
    setFriends((friends) =>
      friends.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );

    setSelectedFriend(null);
  };

  return (
    <>
      <div className="app">
        <div className="sidebar">
          <FriendList
            friends={friends}
            onSelection={handleSelection}
            selectedFriend={selectedFriend}
          />

          {showAddFriend && (
            <FormAddFriend onAddFriend={handleAddFriend} friends={friends} />
          )}

          <Button onClick={handleShowAddFriend}>
            {showAddFriend ? "بستن" : "افزودن"}
          </Button>
        </div>

        {selectedFriend && (
          <FormSplitBill
            selectedFriend={selectedFriend}
            onSplitBill={handleSplitBill}
          />
        )}
      </div>
    </>
  );
};

export default App;

const FriendList = ({ friends, onSelection, selectedFriend }) => {
  return (
    <>
      <ul>
        {friends.map((friend) => {
          return (
            <Friend
              friend={friend}
              key={friend.id}
              selectedFriend={selectedFriend}
              onSelection={onSelection}
            />
          );
        })}
      </ul>
    </>
  );
};

const Friend = ({ friend, onSelection, selectedFriend }) => {
  const isSelected = selectedFriend?.id === friend.id;
  return (
    <>
      <li className={isSelected ? "selected" : ""}>
        <img src={friend.image} alt={friend.name} />
        <h3>{friend.name}</h3>
        {friend.balance < 0 && (
          <p className="red">
            {/* You owe {friend.name} ${Math.abs(friend.balance)} */}
            تو به {friend.name} ${Math.abs(friend.balance)} بدهکاری
          </p>
        )}{" "}
        {friend.balance > 0 && (
          <p className="green">
            {/* {friend.name} owes you ${Math.abs(friend.balance)} */}
            {friend.name} به تو ${Math.abs(friend.balance)} بدهکاره
          </p>
        )}{" "}
        {friend.balance === 0 && <p>تو و {friend.name} حسابتون صافه</p>}
        {/* <p>You and {friend.name} are even</p> */}
        <Button onClick={() => onSelection(friend)}>
          {isSelected ? "بستن" : "انتخاب"}
        </Button>
      </li>
    </>
  );
};
const FormAddFriend = ({ onAddFriend }) => {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !image) return;
    const id = crypto.randomUUID();
    const newFriend = {
      id,
      name,
      image: `${image}?=${id}`,
      balance: 0,
    };
    // console.log(newFriend);
    onAddFriend(newFriend);
    setName("");
    setImage("https://i.pravatar.cc/48");
  };
  return (
    <>
      <form className="form-add-friend" onSubmit={handleSubmit}>
        <label>اسم دوست</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label>آدرس عکس</label>
        <input
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />

        <Button>افزودن دوست</Button>
      </form>
    </>
  );
};

const FormSplitBill = ({ selectedFriend, onSplitBill }) => {
  const [bill, setBill] = useState("");
  const [paidByUser, setPaidByUser] = useState("");
  const paidByFriend = bill ? bill - paidByUser : "";
  const [whoIsPaying, setWhoIsPaying] = useState("user");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!bill || !paidByUser) return;
    onSplitBill(whoIsPaying === "user" ? paidByFriend : -paidByUser);
  };

  return (
    <>
      <form className="form-split-bill" onSubmit={handleSubmit}>
        {/* <h2>Split a bill with {selectedFriend.name} </h2> */}
        <h2> حساب کتاب با {selectedFriend.name}</h2>

        <label>💸 صورت حساب</label>
        <input
          type="text"
          value={bill}
          onChange={(e) => setBill(Number(e.target.value))}
        />

        <label>😎 خرج کرد تو</label>
        <input
          type="text"
          value={paidByUser}
          onChange={(e) =>
            setPaidByUser(
              Number(e.target.value) > bill
                ? paidByUser
                : Number(e.target.value)
            )
          }
        />

        <label>😁 خرج کرد {selectedFriend.name}</label>
        <input type="text" disabled value={paidByFriend} />

        <label>💰 پرداخت کننده</label>
        <select
          value={whoIsPaying}
          onChange={(e) => setWhoIsPaying(e.target.value)}
        >
          <option value="user">تو</option>
          <option value="friend">{selectedFriend.name}</option>
        </select>

        <Button>حساب کن </Button>
      </form>
    </>
  );
};
