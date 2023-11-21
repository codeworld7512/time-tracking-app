import * as React from "react";
import {
  Button,
  Dialog,
  Divider,
  Portal,
  Searchbar,
  Text,
  useTheme,
} from "react-native-paper";
import { i18n } from "../i18n";
import { Pressable, ScrollView } from "react-native";
import { useSelector } from "react-redux";

const ProjectListDialog = ({ defaultValue, setValue, open, setOpen }) => {
  const [projectList, setProjectList] = React.useState([]);
  const {
    myConfig: { projects },
  } = useSelector((state) => state.common);
  const [selectedProject, setSelectedProject] = React.useState({
    label: "",
    value: "",
  });
  const [data, setData] = React.useState([]);
  const theme = useTheme();
  const [visible, setVisible] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  const onChangeSearch = (query) => setSearchQuery(query);

  React.useEffect(() => {
    setData([...projectList]);
  }, [projectList]);

  React.useEffect(() => {
    let array = [];
    projectList.forEach((e) => {
      if (e.label.toLowerCase().includes(searchQuery.toLowerCase()))
        array.push(e);
    });

    setData([...array]);
  }, [searchQuery]);

  React.useEffect(() => {
    setSelectedProject(defaultValue);
  }, [defaultValue]);

  React.useEffect(() => {
    if (selectedProject) setSearchQuery(selectedProject.label);
  }, [selectedProject]);

  React.useEffect(() => {
    var array = [];
    projects.forEach((e) => {
      array.push({ label: e.label, value: String(e.key) });
    });
    setProjectList(array);
  }, [projects]);
  return (
    <Portal>
      <Dialog
        visible={open}
        onDismiss={() => setOpen(false)}
        style={{ margin: 0 }}
      >
        <Dialog.Title>{i18n.t("selectProject")}</Dialog.Title>
        <Dialog.Content>
          <Searchbar
            placeholder={i18n.t("searchProject")}
            onChangeText={onChangeSearch}
            value={searchQuery}
            style={{ borderColor: theme.colors.backdrop, borderWidth: 1 }}
            autoFocus
            onClearIconPress={() => setSelectedProject(null)}
          />
          <Divider style={{ marginVertical: 10, height: 2 }} />
          <ScrollView style={{ maxHeight: 150, minHeight: 150 }}>
            {data.length !== 0 ? (
              data.map((e) => (
                <Pressable key={e.value} onPress={() => setSelectedProject(e)}>
                  <Text style={{ paddingTop: 5 }}>{e.label}</Text>
                  <Divider style={{ marginTop: 5 }} />
                </Pressable>
              ))
            ) : (
              <Text style={{ textAlign: "center" }}>{i18n.t("notFound")}</Text>
            )}
          </ScrollView>
          <Divider style={{ height: 2 }} />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => setOpen(false)} mode="outlined">
            {i18n.t("close")}
          </Button>
          <Button
            onPress={() => {
              setValue("projectNumber", selectedProject);
              setOpen(false);
            }}
            mode="contained"
          >
            {i18n.t("done")}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

export default ProjectListDialog;
