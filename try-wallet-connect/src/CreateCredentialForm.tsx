import React, { useState } from "react";

interface Props {
  handleClick: (tokenId: number, lifetime: number, delegatee: string) => void;
}

const CreateCredentialForm: React.FC<Props> = ({ handleClick }) => {
  const [lifetime, setLifetime] = useState<number>(0);
  const [delegatee, setDelegatee] = useState<string>("");
  const [nftTokenId, setNFTTokenId] = useState<number>(0);

  const handleInputChange = (event: any) => {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    if (name === "lifetime") {
      setLifetime(value);
    } else if (name === "nftTokenId") {
      setNFTTokenId(value);
    } else if (name === "delegatee") {
      setDelegatee(value);
    }
  };
  return (
    <div>
      <form>
        <label>
          Address you'll delegate the ownership
          <input
            name="delegatee"
            type="text"
            value={delegatee}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          Credentials' Lifetime (days)
          <input
            name="lifetime"
            type="number"
            value={lifetime}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <label>
          tokenID of your NFT
          <input
            name="nftTokenId"
            type="number"
            value={nftTokenId}
            onChange={handleInputChange}
          />
        </label>
        <br />
        <button
          onClick={(e) => {
            e.preventDefault();
            handleClick(nftTokenId, lifetime, delegatee);
          }}
        >
          Create!
        </button>
      </form>
    </div>
  );
};

export default CreateCredentialForm;
