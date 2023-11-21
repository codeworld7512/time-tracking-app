import * as React from "react";
import { SafeAreaView, ScrollView, View } from "react-native";
import { Button, HelperText, Text, useTheme } from "react-native-paper";
import { commonStyles } from "../../../styles";
import { useSelector } from "react-redux";
import { i18n } from "../../../i18n";
import DropDown from "react-native-paper-dropdown";
import { Controller, useForm } from "react-hook-form";
import { DatePickerInput } from "react-native-paper-dates";
import { labelToDropdownList } from "../../../utils/labelToDropdownList";
import { stringToDropDownList } from "../../../utils/stringToDropDownList";
import { Autocomplete } from "@telenko/react-native-paper-autocomplete";
import { store } from "../../../redux/store";
import { SET_CREATE_HOUR_REG } from "../../../redux/actionTypes";

export default function DetailsScreen({ navigation }) {
  const { createHourReg } = useSelector((state) => state.hours);
  const theme = useTheme();
  const {
    setValue,
    formState: { isSubmitting, errors },
    clearErrors,
    setError,
    handleSubmit,
    watch,
    control,
  } = useForm({
    defaultValues: {
      projectNumber: createHourReg?.projectNumber,
      hDate: createHourReg?.hDate ? new Date(createHourReg?.hDate) : new Date(),
      startTime: null,
      endTime: null,
      activityCode: createHourReg?.activityCode,
      username: createHourReg?.username,
      subProject: createHourReg?.subProject,
    },
  });
  const [projectList, setProjectList] = React.useState([]);
  const [subProjectList, setSubProjectList] = React.useState([]);
  const [showDropDown, setShowDropDown] = React.useState({
    projects: false,
    subProjects: false,
    startTime: false,
    endTime: false,
    activityCode: false,
  });
  const {
    myConfig: {
      username,
      keys: {
        HoursShowActivity,
        HoursShowProject,
        HoursActivitycodes,
        HoursTimeslots,
        HoursTimestart,
        HoursTimeend,
        HoursAllowchangedate,
        HoursMandatorysubproject,
      },
      projects,
    },
  } = useSelector((state) => state.common);

  const handleNext = (data) => {
    data.hDate = data.hDate.toISOString();
    data.username = username;
    store.dispatch({
      type: SET_CREATE_HOUR_REG,
      payload: { ...createHourReg, ...data },
    });
    navigation.push("Hours");
  };

  React.useEffect(() => {
    setValue("startTime", createHourReg?.startTime || HoursTimestart);
    setValue("endTime", createHourReg?.endTime || HoursTimeend);
  }, [createHourReg]);

  React.useEffect(() => {
    var array;
    if (HoursShowProject) {
      array = [];
      projects.forEach((e) => {
        array.push({ label: e.label, value: String(e.key) });
      });
      setProjectList(array);
    }
  }, [projects]);

  React.useEffect(() => {
    projects.forEach((e) => {
      if (e.key == watch("projectNumber")) setSubProjectList(e.subProjects);
    });
  }, [watch("projectNumber")]);

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={commonStyles.container}>
          <Text variant="titleLarge">{i18n.t("whoWhereAndWhen")}</Text>
          <Controller
            control={control}
            rules={{
              required: { value: true, message: i18n.t("thisIsRequired") },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <DatePickerInput
                locale="en"
                onBlur={onBlur}
                label={i18n.t("date")}
                value={value}
                onChange={onChange}
                inputMode="start"
                style={commonStyles.mt20}
                disabled={!HoursAllowchangedate}
              />
            )}
            name="hDate"
          />

          <HelperText type="error" visible={!!errors.hDate}>
            {errors?.hDate?.message}
          </HelperText>

          <View>
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <DropDown
                  label={i18n.t("startTime")}
                  visible={showDropDown.startTime}
                  showDropDown={() =>
                    setShowDropDown({ ...showDropDown, startTime: true })
                  }
                  onDismiss={() =>
                    setShowDropDown({ ...showDropDown, startTime: false })
                  }
                  value={value}
                  setValue={onChange}
                  list={labelToDropdownList(HoursTimeslots)}
                  dropDownItemTextStyle={{ color: theme.colors.onBackground }}
                />
              )}
              name="startTime"
            />
            <HelperText type="error" visible={!!errors.startTime}>
              {errors?.startTime?.message}
            </HelperText>
          </View>
          <View>
            <Controller
              control={control}
              render={({ field: { onChange, value } }) => (
                <DropDown
                  label={i18n.t("endTime")}
                  visible={showDropDown.endTime}
                  showDropDown={() =>
                    setShowDropDown({ ...showDropDown, endTime: true })
                  }
                  onDismiss={() =>
                    setShowDropDown({ ...showDropDown, endTime: false })
                  }
                  value={value}
                  setValue={onChange}
                  list={labelToDropdownList(HoursTimeslots)}
                  dropDownItemTextStyle={{ color: theme.colors.onBackground }}
                />
              )}
              name="endTime"
            />
            <HelperText type="error" visible={!!errors.endTime}>
              {errors?.endTime?.message}
            </HelperText>
          </View>
          {HoursShowProject && (
            <View>
              {projectList.length !== 0 && (
                <Controller
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Autocomplete
                      multiple={false}
                      value={[value]}
                      onChange={onChange}
                      options={projectList}
                      label={i18n.t("selectProject")}
                    />
                  )}
                  name="projectNumber"
                />
              )}
              {/* {projectList.length !== 0 && (
                <AutocompleteDropdown
                  // clearOnFocus={false}
                  // closeOnBlur={true}
                  // closeOnSubmit={false}
                  initialValue={{ id: "1000" }} // or just '2'
                  onSelectItem={(item) => setValue("projectNumber", item)}
                  dataSet={projectList}
                />
              )} */}
              <HelperText type="error" visible={!!errors.projectNumber}>
                {errors?.projectNumber?.message}
              </HelperText>
            </View>
          )}

          {subProjectList.length > 0 && (
            <View>
              <Controller
                control={control}
                rules={{
                  required: {
                    value: HoursMandatorysubproject,
                    message: i18n.t("thisIsRequired"),
                  },
                }}
                render={({ field: { onChange, value } }) => (
                  <DropDown
                    label={i18n.t("subProjects")}
                    visible={showDropDown.subProjects}
                    showDropDown={() =>
                      setShowDropDown({ ...showDropDown, subProjects: true })
                    }
                    onDismiss={() =>
                      setShowDropDown({ ...showDropDown, subProjects: false })
                    }
                    value={value}
                    setValue={onChange}
                    list={labelToDropdownList(subProjectList)}
                    dropDownItemTextStyle={{
                      color: theme.colors.onBackground,
                    }}
                  />
                )}
                name="subProject"
              />
              <HelperText type="error" visible={!!errors.subProject}>
                {errors?.subProject?.message}
              </HelperText>
            </View>
          )}

          {HoursShowActivity && (
            <View>
              <Controller
                control={control}
                render={({ field: { onChange, onBlur, value } }) => (
                  <DropDown
                    label={i18n.t("activityCode")}
                    visible={showDropDown.activityCode}
                    showDropDown={() =>
                      setShowDropDown({ ...showDropDown, activityCode: true })
                    }
                    onDismiss={() =>
                      setShowDropDown({
                        ...showDropDown,
                        activityCode: false,
                      })
                    }
                    value={value}
                    setValue={onChange}
                    list={stringToDropDownList(HoursActivitycodes)}
                    dropDownItemTextStyle={{
                      color: theme.colors.onBackground,
                    }}
                  />
                )}
                name="activityCode"
              />
              <HelperText type="error" visible={!!errors.activityCode}>
                {errors?.activityCode?.message}
              </HelperText>
            </View>
          )}

          <Button
            mode="contained"
            onPress={handleSubmit(handleNext)}
            style={commonStyles.mt20}
          >
            {i18n.t("next")}
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
