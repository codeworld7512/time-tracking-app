import * as React from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  Pressable,
} from "react-native";
import { commonStyles } from "../../styles";
import {
  HelperText,
  Text,
  TextInput,
  useTheme,
  Checkbox,
  Button,
  ProgressBar,
} from "react-native-paper";
import { useEffect, useState } from "react";
import { apis } from "../../apis";
import { i18n } from "../../i18n";
import { Controller, useForm } from "react-hook-form";
import DropDown from "react-native-paper-dropdown";
import { labelToDropdownList } from "../../utils/labelToDropdownList";
import { DatePickerInput } from "react-native-paper-dates";
import { useSelector } from "react-redux";
// import { Autocomplete } from "@telenko/react-native-paper-autocomplete";
import { stringToDropDownList } from "../../utils/stringToDropDownList";
import { getBreakHours, getWorkHours } from "../../utils";
import useSnackbar from "../../context/userSnackbar";
import {
  AutocompleteScrollView,
  Autocomplete,
} from "react-native-paper-autocomplete";
import ProjectListDialog from "../../components/ProjectListDialog";

export default function HourRegEditScreen({ navigation, route }) {
  const [openProjectListDialog, setOpenProjectListDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const theme = useTheme();
  const [openDialog, setOpenDialog] = useState({ delete: false });
  const { dispatch: showSnackbar } = useSnackbar();
  const {
    setValue,
    formState: { isSubmitting, errors },
    clearErrors,
    setError,
    watch,
    handleSubmit,
    control,
  } = useForm({
    defaultValues: {
      projectNumber: "",
      hDate: null,
      startTime: null,
      endTime: null,
      activityCode: null,
      username: null,
      subProject: null,
      hoursTotal: null,
      hours50: null,
      hours100: null,
      hoursBreak: null,
      extra1Type: null,
      extra1: null,
      extra2Type: null,
      extra2: null,
      comment: null,
      km: null,
      kmExtraTypes: [],
      kmDescription: null,
      toll: null,
      parking: null,
      dietType: null,
      dietFrom: null,
      dietTo: null,
      outlay: null,
      outlayDescription: null,
      outlayType: null,
    },
  });

  const [subProjectList, setSubProjectList] = React.useState([]);
  const [showDropDown, setShowDropDown] = React.useState({
    projects: false,
    startTime: false,
    endTime: false,
    activityCode: false,
    extra1Type: false,
    extra2Type: false,
    dietType: false,
    dietFrom: false,
    dietTo: false,
    subProjects: false,
  });

  const {
    myConfig: {
      keys: {
        HoursMandatorysubproject,
        HoursShowActivity,
        HoursShowProject,
        HoursActivitycodes,
        HoursTimeslots,
        HoursExtras,
        HoursShowbreak,
        HoursShowextra1,
        HoursShowextra2,
        HoursExtraskm,
        HoursDiets,
        HoursOutlaytypes,
        HoursShowkm,
        HoursShowtoll,
        HoursShowparking,
        HoursShowdiet,
        HoursShow40Pctovertime,
        HoursShow50Pctovertime,
        HoursShow100Pctovertime,
        HoursShow133Pctovertime,
        HoursShowoutlay,
        HoursShowtraveltime,
        HoursAllowchangedate,
        HoursMandatorycomment,
      },
      projects,
    },
  } = useSelector((state) => state.common);

  const { params } = route;
  React.useEffect(() => {
    projects.forEach((e) => {
      if (e.key == watch("projectNumber")) {
        setSubProjectList(e.subProjects);
      }
    });
  }, [watch("projectNumber")]);

  useEffect(() => {
    init();
  }, [projects]);
  const init = async () => {
    try {
      setIsLoading(true);
      const { data } = await apis.getHourReg(params.id);
      setValue("hDate", new Date(data.hDate));
      setValue("startTime", data.startTime);
      setValue("endTime", data.endTime);
      setValue(
        "activityCode",
        data.activityCode !== null ? String(data.activityCode) : ""
      );
      setValue("username", data.username);
      setValue("subProject", data.subProject);
      setValue("hoursTotal", data.hoursTotal && String(data.hoursTotal));
      setValue("hours50", data.hours50 && String(data.hours50));
      setValue("hours100", data.hours100 && String(data.hours100));
      setValue("hoursBreak", data.hoursBreak && String(data.hoursBreak));
      setValue("extra1Type", data.extra1Type);
      setValue("extra1", data.extra1 && String(data.extra1));
      setValue("extra2Type", data.extra2Type);
      setValue("extra2", data.extra2 && String(data.extra2));
      setValue("comment", data.comment);
      setValue("km", data.km && String(data.km));
      setValue("kmExtraTypes", String(data.kmExtraTypes).split(","));
      setValue("kmDescription", data.kmDescription);
      setValue("toll", data.toll && String(data.toll));
      setValue("parking", data.parking && String(data.parking));
      setValue("dietType", data.dietType && String(data.dietType));
      setValue("dietFrom", data.dietFrom);
      setValue("dietTo", data.dietTo);
      setValue("outlay", data.outlay && String(data.outlay));
      setValue("outlayDescription", data.outlayDescription);
      setValue("outlayType", data.outlayType);
      projects.forEach((e) => {
        if (String(e.key) === String(data.projectNumber)) {
          setValue("projectNumber", {value: e.key, label: e.label});
        }
      });
      setValue("travelTime", data?.travelTime);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (data) => {
    try {
      data.projectNumber = data.projectNumber.value;
      await apis.updateHourReg(params.id, data);
      setOpenDialog({ ...openDialog, delete: false });
      showSnackbar({
        type: "open",
        message: i18n.t("hourRegistrationHaveUpdatedSuccessfully"),
        snackbarType: "success",
      });
      navigation.goBack();
    } catch (error) {
      console.log(error);
      setOpenDialog({ ...openDialog, delete: false });
      showSnackbar({
        type: "open",
        message: i18n.t("somethingWentWrong"),
        snackbarType: "error",
      });
    }
  };
  return (
    <SafeAreaView>
      <AutocompleteScrollView>
        {isLoading ? (
          <ProgressBar indeterminate />
        ) : (
          <View style={commonStyles.container}>
            <ProjectListDialog
              setValue={setValue}
              open={openProjectListDialog}
              setOpen={setOpenProjectListDialog}
              defaultValue={watch("projectNumber")}
            />
            <View>
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
                      dropDownItemTextStyle={{
                        color: theme.colors.onBackground,
                      }}
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
                      dropDownItemTextStyle={{
                        color: theme.colors.onBackground,
                      }}
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
                  <TextInput
                    value={watch("projectNumber")?.label}
                    label={i18n.t("selectProject")}
                    onFocus={() => setOpenProjectListDialog(true)}
                    // right={<TextInput.Icon icon="close" onPress={() => setValue("projectNumber", "")}/>}
                  />
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
                          setShowDropDown({
                            ...showDropDown,
                            subProjects: true,
                          })
                        }
                        onDismiss={() =>
                          setShowDropDown({
                            ...showDropDown,
                            subProjects: false,
                          })
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
                          setShowDropDown({
                            ...showDropDown,
                            activityCode: true,
                          })
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
            </View>
            <View>
              <Text variant="titleLarge">{i18n.t("hours")}</Text>

              <Controller
                control={control}
                rules={{
                  required: { value: true, message: i18n.t("thisIsRequired") },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label={i18n.t("hoursTotal")}
                    keyboardType="numeric"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={String(value)}
                    error={errors.hoursTotal}
                    style={commonStyles.mt20}
                  />
                )}
                name="hoursTotal"
              />
              <HelperText type="error" visible={!!errors.hoursTotal}>
                {errors?.hoursTotal?.message}
              </HelperText>

              {HoursShow40Pctovertime && (
                <View>
                  <Controller
                    control={control}
                    // rules={{
                    //   required: { value: true, message: i18n.t("thisIsRequired") },
                    // }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        label={i18n.t("overtime40")}
                        keyboardType="numeric"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        error={errors.hours40}
                      />
                    )}
                    name="hours40"
                  />

                  <HelperText type="error" visible={!!errors.hours40}>
                    {errors?.hours40?.message}
                  </HelperText>
                </View>
              )}

              {HoursShow50Pctovertime && (
                <View>
                  <Controller
                    control={control}
                    // rules={{
                    //   required: { value: true, message: i18n.t("thisIsRequired") },
                    // }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        label={i18n.t("overtime50")}
                        keyboardType="numeric"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        error={errors.hours50}
                      />
                    )}
                    name="hours50"
                  />

                  <HelperText type="error" visible={!!errors.hours50}>
                    {errors?.hours50?.message}
                  </HelperText>
                </View>
              )}
              {HoursShow100Pctovertime && (
                <View>
                  <Controller
                    control={control}
                    // rules={{
                    //   required: { value: true, message: i18n.t("thisIsRequired") },
                    // }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        label={i18n.t("overtime100")}
                        keyboardType="numeric"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        error={errors.hours100}
                      />
                    )}
                    name="hours100"
                  />

                  <HelperText type="error" visible={!!errors.hours100}>
                    {errors?.hours100?.message}
                  </HelperText>
                </View>
              )}
              {HoursShow133Pctovertime && (
                <View>
                  <Controller
                    control={control}
                    // rules={{
                    //   required: { value: true, message: i18n.t("thisIsRequired") },
                    // }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        label={i18n.t("overtime133")}
                        keyboardType="numeric"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        error={errors.hours133}
                      />
                    )}
                    name="hours100"
                  />

                  <HelperText type="error" visible={!!errors.hours133}>
                    {errors?.hours133?.message}
                  </HelperText>
                </View>
              )}

              {HoursShowbreak && (
                <Controller
                  control={control}
                  // rules={{
                  //   required: { value: true, message: i18n.t("thisIsRequired") },
                  // }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      label={i18n.t("hoursBreak")}
                      keyboardType="numeric"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      error={errors.hoursBreak}
                    />
                  )}
                  name="hoursBreak"
                />
              )}

              <HelperText type="error" visible={!!errors.hoursBreak}>
                {errors?.hoursBreak?.message}
              </HelperText>

              {HoursShowextra1 && (
                <View style={styles.container1}>
                  <View style={{ flex: 1 }}>
                    <Controller
                      control={control}
                      // rules={{
                      //   required: {
                      //     value: true,
                      //     message: i18n.t("thisIsRequired"),
                      //   },
                      // }}
                      render={({ field: { onChange, value } }) => (
                        <DropDown
                          label={i18n.t("extra1Type")}
                          visible={showDropDown.extra1Type}
                          showDropDown={() =>
                            setShowDropDown({
                              ...showDropDown,
                              extra1Type: true,
                            })
                          }
                          onDismiss={() =>
                            setShowDropDown({
                              ...showDropDown,
                              extra1Type: false,
                            })
                          }
                          value={value}
                          setValue={onChange}
                          list={stringToDropDownList(HoursExtras)}
                          dropDownItemTextStyle={{
                            color: theme.colors.onBackground,
                          }}
                          style={{ flex: 1 }}
                        />
                      )}
                      name="extra1Type"
                    />

                    <HelperText type="error" visible={!!errors.extra1Type}>
                      {errors?.extra1Type?.message}
                    </HelperText>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Controller
                      control={control}
                      // rules={{
                      //   required: {
                      //     value: true,
                      //     message: i18n.t("thisIsRequired"),
                      //   },
                      // }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          label={i18n.t("extra1")}
                          keyboardType="numeric"
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                          error={errors.extra1}
                        />
                      )}
                      name="extra1"
                    />

                    <HelperText type="error" visible={!!errors.extra1}>
                      {errors?.extra1?.message}
                    </HelperText>
                  </View>
                </View>
              )}
              {HoursShowextra2 && (
                <View style={styles.container1}>
                  <View style={{ flex: 1 }}>
                    <Controller
                      control={control}
                      // rules={{
                      //   required: {
                      //     value: true,
                      //     message: i18n.t("thisIsRequired"),
                      //   },
                      // }}
                      render={({ field: { onChange, value } }) => (
                        <DropDown
                          label={i18n.t("extra2Type")}
                          visible={showDropDown.extra2Type}
                          showDropDown={() =>
                            setShowDropDown({
                              ...showDropDown,
                              extra2Type: true,
                            })
                          }
                          onDismiss={() =>
                            setShowDropDown({
                              ...showDropDown,
                              extra2Type: false,
                            })
                          }
                          value={value}
                          setValue={onChange}
                          list={stringToDropDownList(HoursExtras)}
                          dropDownItemTextStyle={{
                            color: theme.colors.onBackground,
                          }}
                          style={{ flex: 1 }}
                        />
                      )}
                      name="extra2Type"
                    />

                    <HelperText type="error" visible={!!errors.extra2Type}>
                      {errors?.extra2Type?.message}
                    </HelperText>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Controller
                      control={control}
                      // rules={{
                      //   required: {
                      //     value: true,
                      //     message: i18n.t("thisIsRequired"),
                      //   },
                      // }}
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          label={i18n.t("extra2")}
                          keyboardType="numeric"
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                          error={errors.extra2}
                        />
                      )}
                      name="extra2"
                    />

                    <HelperText type="error" visible={!!errors.extra2}>
                      {errors?.extra2?.message}
                    </HelperText>
                  </View>
                </View>
              )}
              <Controller
                control={control}
                rules={{
                  required: {
                    value: HoursMandatorycomment,
                    message: i18n.t("thisIsRequired"),
                  },
                }}
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label={i18n.t("comments")}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    error={errors.comment}
                    multiline
                    numberOfLines={3}
                  />
                )}
                name="comment"
              />

              <HelperText type="error" visible={!!errors.comment}>
                {errors?.comment?.message}
              </HelperText>
            </View>
            <View>
              <Text variant="titleLarge">{i18n.t("allowances")}</Text>
              {HoursShowkm && (
                <Controller
                  control={control}
                  rules={{
                    required: {
                      value: true,
                      message: i18n.t("thisIsRequired"),
                    },
                  }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      label={i18n.t("km")}
                      keyboardType="numeric"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      error={errors.km}
                      style={commonStyles.mt20}
                    />
                  )}
                  name="km"
                />
              )}

              <HelperText type="error" visible={!!errors.km}>
                {errors?.km?.message}
              </HelperText>

              <Text variant="bodyLarge">{i18n.t("kmExtra")}</Text>
              {stringToDropDownList(HoursExtraskm).map((item, index) => (
                <Pressable
                  style={styles.checkboxContainer}
                  onPress={() => {
                    var value = watch("kmExtraTypes");
                    if (value.includes(item.value)) {
                      value = value.filter((e) => e !== item.value);
                      setValue("kmExtraTypes", value);
                    } else {
                      value.push(item.value);
                      setValue("kmExtraTypes", value);
                    }
                  }}
                  key={item.value}
                >
                  <Checkbox
                    status={
                      watch("kmExtraTypes").includes(item.value)
                        ? "checked"
                        : "unchecked"
                    }
                  />
                  <Text> {item.label}</Text>
                </Pressable>
              ))}
              <View>
                <Controller
                  control={control}
                  // rules={{
                  //   required: { value: true, message: i18n.t("thisIsRequired") },
                  // }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      label={i18n.t("descriptionAndTravelRoute")}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      error={errors.kmDescription}
                      multiline
                      numberOfLines={3}
                      style={commonStyles.mt20}
                    />
                  )}
                  name="kmDescription"
                />
                <HelperText type="error" visible={!!errors.kmDescription}>
                  {errors?.kmDescription?.message}
                </HelperText>
              </View>
              {HoursShowtraveltime && (
                <View>
                  <Controller
                    control={control}
                    // rules={{
                    //   required: { value: true, message: i18n.t("thisIsRequired") },
                    // }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        label={i18n.t("descriptionAndTravelRoute")}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        error={errors.kmDescription}
                        multiline
                        numberOfLines={3}
                        style={commonStyles.mt20}
                      />
                    )}
                    name="travelTime "
                  />
                  <HelperText type="error" visible={!!errors.travelTime}>
                    {errors?.travelTime?.message}
                  </HelperText>
                </View>
              )}
              {HoursShowtoll && (
                <Controller
                  control={control}
                  // rules={{
                  //   required: { value: true, message: i18n.t("thisIsRequired") },
                  // }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      label={i18n.t("toll")}
                      keyboardType="numeric"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      error={errors.toll}
                    />
                  )}
                  name="toll"
                />
              )}

              <HelperText type="error" visible={!!errors.toll}>
                {errors?.toll?.message}
              </HelperText>

              {HoursShowparking && (
                <Controller
                  control={control}
                  // rules={{
                  //   required: { value: true, message: i18n.t("thisIsRequired") },
                  // }}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      label={i18n.t("parking")}
                      keyboardType="numeric"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      error={errors.parking}
                    />
                  )}
                  name="parking"
                />
              )}

              <HelperText type="error" visible={!!errors.parking}>
                {errors?.parking?.message}
              </HelperText>

              {HoursShowdiet && (
                <View>
                  <Controller
                    control={control}
                    // rules={{
                    //   required: { value: true, message: i18n.t("thisIsRequired") },
                    // }}
                    render={({ field: { onChange, value } }) => (
                      <DropDown
                        label={i18n.t("dietType")}
                        visible={showDropDown.dietType}
                        showDropDown={() =>
                          setShowDropDown({ ...showDropDown, dietType: true })
                        }
                        onDismiss={() =>
                          setShowDropDown({ ...showDropDown, dietType: false })
                        }
                        value={value}
                        setValue={onChange}
                        list={stringToDropDownList(HoursDiets)}
                        dropDownItemTextStyle={{
                          color: theme.colors.onBackground,
                        }}
                        style={{ flex: 1 }}
                      />
                    )}
                    name="dietType"
                  />

                  <HelperText type="error" visible={!!errors.dietType}>
                    {errors?.dietType?.message}
                  </HelperText>
                </View>
              )}
              <Text variant="bodyLarge" style={commonStyles.mb10}>
                {i18n.t("dietPeriod")}
              </Text>
              <View style={{ flex: 1, flexDirection: "row", gap: 10 }}>
                <View style={{ flex: 1 }}>
                  <Controller
                    control={control}
                    // rules={{
                    //   required: { value: true, message: i18n.t("thisIsRequired") },
                    // }}
                    render={({ field: { onChange, value } }) => (
                      <DropDown
                        label={i18n.t("dietFrom")}
                        visible={showDropDown.dietFrom}
                        showDropDown={() =>
                          setShowDropDown({ ...showDropDown, dietFrom: true })
                        }
                        onDismiss={() =>
                          setShowDropDown({ ...showDropDown, dietFrom: false })
                        }
                        value={value}
                        setValue={onChange}
                        list={labelToDropdownList(HoursTimeslots)}
                        dropDownItemTextStyle={{
                          color: theme.colors.onBackground,
                        }}
                      />
                    )}
                    name="dietFrom"
                  />
                  <HelperText type="error" visible={!!errors.dietFrom}>
                    {errors?.dietFrom?.message}
                  </HelperText>
                </View>
                <View style={{ flex: 1 }}>
                  <Controller
                    control={control}
                    // rules={{
                    //   required: { value: true, message: i18n.t("thisIsRequired") },
                    // }}
                    render={({ field: { onChange, value } }) => (
                      <DropDown
                        label={i18n.t("dietTo")}
                        visible={showDropDown.dietTo}
                        showDropDown={() =>
                          setShowDropDown({ ...showDropDown, dietTo: true })
                        }
                        onDismiss={() =>
                          setShowDropDown({ ...showDropDown, dietTo: false })
                        }
                        value={value}
                        setValue={onChange}
                        list={labelToDropdownList(HoursTimeslots)}
                        dropDownItemTextStyle={{
                          color: theme.colors.onBackground,
                        }}
                      />
                    )}
                    name="dietTo"
                  />
                  <HelperText type="error" visible={!!errors.dietTo}>
                    {errors?.dietTo?.message}
                  </HelperText>
                </View>
              </View>

              {HoursShowoutlay && (
                <View>
                  <Controller
                    control={control}
                    // rules={{
                    //   required: { value: true, message: i18n.t("thisIsRequired") },
                    // }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        label={i18n.t("outlay")}
                        keyboardType="numeric"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        error={errors.outlay}
                      />
                    )}
                    name="outlay"
                  />
                  <HelperText type="error" visible={!!errors.outlay}>
                    {errors?.outlay?.message}
                  </HelperText>
                </View>
              )}
              {HoursShowoutlay && (
                <View>
                  <Controller
                    control={control}
                    // rules={{
                    //   required: { value: true, message: i18n.t("thisIsRequired") },
                    // }}
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        label={i18n.t("outlayDescription")}
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        error={errors.outlay}
                        multiline
                        numberOfLines={3}
                      />
                    )}
                    name="outlayDescription"
                  />
                  <HelperText type="error" visible={!!errors.outlayDescription}>
                    {errors?.outlayDescription?.message}
                  </HelperText>
                </View>
              )}

              <Controller
                control={control}
                // rules={{
                //   required: { value: true, message: i18n.t("thisIsRequired") },
                // }}
                render={({ field: { onChange, value } }) => (
                  <DropDown
                    label={i18n.t("outlayType")}
                    visible={showDropDown.outlayType}
                    showDropDown={() =>
                      setShowDropDown({ ...showDropDown, outlayType: true })
                    }
                    onDismiss={() =>
                      setShowDropDown({ ...showDropDown, outlayType: false })
                    }
                    value={value}
                    setValue={onChange}
                    list={stringToDropDownList(HoursOutlaytypes)}
                    dropDownItemTextStyle={{ color: theme.colors.onBackground }}
                  />
                )}
                name="outlayType"
              />
              <HelperText type="error" visible={!!errors.outlayType}>
                {errors?.outlayType?.message}
              </HelperText>
            </View>

            <Button
              mode="contained"
              onPress={handleSubmit(handleUpdate)}
              style={commonStyles.mv10}
              loading={isSubmitting}
              disabled={isSubmitting}
            >
              {i18n.t("update")}
            </Button>
            <Button
              mode="outlined"
              onPress={() => navigation.goBack()}
              style={commonStyles.mb60}
            >
              {i18n.t("back")}
            </Button>
          </View>
        )}
      </AutocompleteScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    flexDirection: "row",
    gap: 10,
  },
  checkboxContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
});
