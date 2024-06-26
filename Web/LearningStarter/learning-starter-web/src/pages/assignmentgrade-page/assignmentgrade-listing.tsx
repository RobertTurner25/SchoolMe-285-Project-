import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Center, Container, Flex, Space, Table, Title, createStyles } from "@mantine/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faPlus, faTruckMonster } from "@fortawesome/free-solid-svg-icons";
import { routes } from "../../routes";
import api from "../../config/axios";
import { ApiResponse, AssignmentGetDto } from "../../constants/types";

export const GradePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { classes } = useStyles();
  const [assignment, setAssignment] = useState<AssignmentGetDto | null>(null);

  
  
    async function fetchAssignment() {
      try {
        const response = await api.get<ApiResponse<AssignmentGetDto>>(`/api/assignments/${id}`);
        
        if (response.data.hasErrors) {
          // Handle errors here
        } else {
          setAssignment(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching assignment:", error);
      }
    }
  
  useEffect(() => {
    fetchAssignment();
  }, [id]);

  return (
    <Container>
      <Button
        onClick={() => navigate(routes.GroupHome.replace(":id", `${assignment?.groupId}`))}
        style={{
          backgroundColor: "transparent",
          border: "none",
          cursor: "pointer",
        }}
      >
        <FontAwesomeIcon icon={faArrowLeft} size="xl" />
      </Button>
      <Flex direction="row" justify="space-between">
        <Button
        style={{backgroundColor:  `#F9E925`, color: `black`}}
          onClick={() => navigate(routes.AssignmentGradeCreate.replace(":id", `${assignment?.id}`))}
        >
          <FontAwesomeIcon icon={faPlus} /> <Space w={8} />
          Add Grade
        </Button>
      </Flex>

      <Center>
        <Title>{assignment?.assignmentName}</Title>
        <Space h="lg" />
      </Center>

      {assignment &&(
        <Table withBorder fontSize={15}>
          <thead>
            <tr>
              <th></th>
              <th>Grades</th>
            </tr>
          </thead>
          <tbody>
            {assignment.grades.map((grade, index) => (
              <tr key={index}>
                
                <td>{grade.grades}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) }
      
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
