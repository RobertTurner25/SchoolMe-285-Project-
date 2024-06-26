import React, { useEffect, useState } from "react";
import {
  Button,
  Container,
  createStyles,
  Space,
  Table,
} from "@mantine/core";
import { useNavigate, useParams } from "react-router-dom";
import {
  FlashCardSetGetDto,
  ApiResponse,
} from "../../constants/types";
import api from "../../config/axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faPen,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { routes } from "../../routes";
import "./FlashCardListing.css"; 
import Flashcard from "../../components/FlashCards/Flashcard";
import { useUser } from "../../authentication/use-auth";
import { UpdateDeleteButton } from "../Group-page/three-dots";

export const FlashCardListing: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { classes } = useStyles();
  const [fcset, setFCSet] = useState<FlashCardSetGetDto | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const user = useUser();

  async function fetchSet() {
    try {
      const response = await api.get<ApiResponse<FlashCardSetGetDto>>(
        `/api/FCSets/${id}`
      );
      if (!response.data.hasErrors) {
        setFCSet(response.data.data);
        setIsFlipped(false); // Reset flipped state
      }
    } catch (error) {
      console.error("Error fetching set:", error);
      // Handle errors
    }
  }

  const handleFlashCardDelete = async (flashCardId: number) => {
    try {
      const response = await api.delete<ApiResponse<any>>(
        `/api/flashcards/${flashCardId}`
      );

      if (response.data.hasErrors) {
        console.error("Error deleting flashcard:", response.data.errors);
        // Handle errors (maybe show a notification)
      } else {
        // Handle success (maybe show a notification)
        fetchSet();
        // Reset the current card index and set fcset to null
        setCurrentCardIndex(0);
        setFCSet(null);
      }
    } catch (error) {
      console.error("Error deleting flashcard:", error);
      // Handle errors (maybe show a notification)
    }
  };

  useEffect(() => {
    fetchSet();
  }, [id]);

  return (
    <Container>
      {fcset && (
        <div>
          <Button
            onClick={() => navigate(routes.GroupHome.replace(":id", `${fcset.groupId}`))}
            style={{
              backgroundColor: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            <FontAwesomeIcon icon={faArrowLeft} size="xl" />
          </Button>
          {user.id === fcset.userId && (
            <Button
            style={{backgroundColor:  `#F9E925`, color: `black`}}
              onClick={() => {
                navigate(routes.FCQuestionCreate.replace(":id", `${fcset.id}`));
              }}
            >
              <FontAwesomeIcon icon={faPlus} /> Add Flashcard
            </Button>
          )}
          <Space h={18} />
          {fcset && (
            <div
              style={{
                textAlign: "center",
                position: "relative",
                perspective: "1000px",
              }}
            >
             {fcset.flashCards.length > 0 && (
  <div
    style={{
      textAlign: "center",
      position: "relative",
      perspective: "1000px",
    }}
  >
    <div
      className={`flashcard ${isFlipped ? "flipped" : ""}`}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div className="front">
        <Flashcard
          question={fcset.flashCards[currentCardIndex].question}
          isFlipped={isFlipped}
          onClick={() => setIsFlipped(!isFlipped)}
          answer={""}
        />
      </div>
      <div className="back">
        <Flashcard
          answer={fcset.flashCards[currentCardIndex].answer}
          isFlipped={isFlipped}
          onClick={() => setIsFlipped(!isFlipped)}
          question={""}
        />
      </div>
      <Space h={18} />
    </div>
    <Button
      onClick={() => {
        setCurrentCardIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : prevIndex
        );
      }}
      className={classes.iconButton}
      style={{ background: "transparent", border: "none" }}
    >
      {"<"}
    </Button>
    <span style={{ margin: "0 16px", fontSize: "18px" }}>
      Card {currentCardIndex + 1} of {fcset.flashCards.length}
    </span>
    <Button
      onClick={() => {
        setCurrentCardIndex((prevIndex) =>
          prevIndex < fcset.flashCards.length - 1 ? prevIndex + 1 : prevIndex
        );
      }}
      className={classes.iconButton}
      style={{ background: "transparent", border: "none" }}
    >
      {">"}
    </Button>
    <Space h={18} />
  </div>
)}

            </div>
          )}
          {fcset && (
            <Table withBorder fontSize={15}>
              <thead>
                <tr>
                  <th></th>
                  <th>Questions</th>
                  <th>Answers</th>
                </tr>
              </thead>
              <tbody>
              {fcset.flashCards.map((flashcard, index) => (
  <tr key={index}>
    <td>
      {user.id === fcset.userId && (
        <UpdateDeleteButton
          onUpdate={() => {
            navigate(routes.FCUpdate.replace(":id", `${flashcard.id}`));
          }}
          onDelete={() => handleFlashCardDelete(flashcard.id)}
        />
      )}
    </td>
    <td>{flashcard.question}</td>
    <td>{flashcard.answer}</td>
  </tr>
))}

              </tbody>
            </Table>
          )}
        </div>
      )}
    </Container>
  );
};

const useStyles = createStyles(() => {
  return {
    iconButton: {
      cursor: "pointer",
    },
  };
});
