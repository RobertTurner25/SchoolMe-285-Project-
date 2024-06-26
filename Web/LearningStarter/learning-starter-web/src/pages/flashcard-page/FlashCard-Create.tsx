import { FormErrors, useForm } from "@mantine/form";
import { ApiResponse, QuestionUpdateDto, TestsGetDto } from "../../constants/types";
import { Button, Container, Flex, Space, TextInput } from "@mantine/core";
import { routes } from "../../routes";
import { useNavigate, useParams } from "react-router-dom";
import { showNotification } from "@mantine/notifications";
import api from "../../config/axios";


export const FCQuestionCreate = () => {
  const navigate = useNavigate();
  const {  id } = useParams();
  const mantineForm = useForm<QuestionUpdateDto>({
    initialValues: {
      question: "",
      answer: "",
    },
  });

  const submitQuestion = async (values: QuestionUpdateDto) => {
    const response = await api.post<ApiResponse<QuestionUpdateDto>>(
      `/api/flashcards/${id}`, 
      values
    );

    if (response.data.hasErrors) {
      const formErrors: FormErrors = response.data.errors.reduce(
        (prev, curr) => {
          Object.assign(prev, { [curr.property]: curr.message });
          return prev;
        },
        {} as FormErrors
      );
      mantineForm.setErrors(formErrors);
    }
    if (response.data.data) {
      showNotification({ message: "New flashcard added", color: "purple" });
      navigate(routes.FlashCardSetListing.replace(":id", `${id}`));
    }
  };

  return (
    <Container>
      <form onSubmit={mantineForm.onSubmit(submitQuestion)}>
        <TextInput
          {...mantineForm.getInputProps("question")}
          maxLength={50} 
          label="Question"
          withAsterisk
          required
        />
        <TextInput
          {...mantineForm.getInputProps("answer")}
          maxLength={50} 
          label="Answer"
          withAsterisk
          required
        />

        <Space h={18} />
        <Flex direction={"row"}>
          <Button style={{backgroundColor:  `#F9E925`, color: `black`}} type="submit">Submit</Button>
          <Space w={10} />
          <Button
          style={{backgroundColor:  `#F9E925`, color: `black`}}
            type="button"
            onClick={() => {
              navigate(routes.FlashCardSetListing.replace(":id", `${id}`));
            }}
          >
            Cancel
          </Button>
        </Flex>
      </form>
    </Container>
  );
};
