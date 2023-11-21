import * as React from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  HelperText,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import { commonStyles } from "../../../styles";
import { Controller, useForm } from "react-hook-form";
import { i18n } from "../../../i18n";
import DropDown from "react-native-paper-dropdown";
import { useSelector } from "react-redux";
import { stringToDropDownList } from "../../../utils/stringToDropDownList";
import { getBreakHours, getWorkHours } from "../../../utils";
import { SET_CREATE_HOUR_REG } from "../../../redux/actionTypes";
import { store } from "../../../redux/store";

export default function HoursScreen({ route, navigation }) {
  const { createHourReg } = useSelector((state) => state.hours);
  const theme = useTheme();
  const {
    setValue,
    formState: { errors },
    handleSubmit,
    control,
    watch,
  } = useForm({
    defaultValues: {
      hoursTotal: createHourReg?.hoursTotal || HoursHoursnormal,
      hours40: createHourReg?.hours40,
      hours50: createHourReg?.hours50,
      hours100: createHourReg?.hours100,
      hours133: createHourReg?.hours133,
      hoursBreak: createHourReg?.hoursBreak,
      extra1Type: createHourReg?.extra1Type,
      extra1: createHourReg?.extra1,
      extra2Type: createHourReg?.extra2Type,
      extra2: createHourReg?.extra2,
      extra3Type: createHourReg?.extra3Type,
      extra3: createHourReg?.extra3,
      comment: createHourReg?.comment,
    },
  });
  const [showDropDown, setShowDropDown] = React.useState({
    extra1Type: false,
    extra2Type: false,
    extra3Type: false,
  });
  const {
    myConfig: {
      keys: {
        HoursExtras,
        HoursHoursnormal,
        HoursShowbreak,
        HoursShowextra1,
        HoursShowextra2,
        HoursShowextra3,
        Hours2ndbreak,
        HoursBreak,
        HoursBreaklength,
        HoursTimeroundto,
        HoursBiasedrounding,
        HoursMandatorycomment,
        HoursShow50Pctovertime,
        HoursShow40Pctovertime,
        HoursShow100Pctovertime,
        HoursShow133Pctovertime,
      },
    },
  } = useSelector((state) => state.common);
  const handleNext = async (data) => {
    try {
      store.dispatch({
        type: SET_CREATE_HOUR_REG,
        payload: { ...createHourReg, ...data },
      });
      navigation.push("Allowances");
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    setValue(
      "hoursTotal",
      String(
        getWorkHours(
          createHourReg?.startTime,
          createHourReg?.endTime,
          HoursBreak,
          Hours2ndbreak,
          HoursBreaklength,
          HoursTimeroundto,
          HoursBiasedrounding
        )
      )
    );
    setValue(
      "hoursBreak",
      String(
        getBreakHours(
          createHourReg?.startTime,
          createHourReg?.endTime,
          HoursBreak,
          Hours2ndbreak,
          HoursBreaklength,
          HoursTimeroundto,
          HoursBiasedrounding
        )
      )
    );
  }, [createHourReg]);

  return (
    <SafeAreaView>
      <ScrollView>
        <View style={commonStyles.container}>
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
                        setShowDropDown({ ...showDropDown, extra1Type: true })
                      }
                      onDismiss={() =>
                        setShowDropDown({ ...showDropDown, extra1Type: false })
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
                        setShowDropDown({ ...showDropDown, extra2Type: true })
                      }
                      onDismiss={() =>
                        setShowDropDown({ ...showDropDown, extra2Type: false })
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

          {HoursShowextra3 && (
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
                      visible={showDropDown.extra3Type}
                      showDropDown={() =>
                        setShowDropDown({ ...showDropDown, extra3Type: true })
                      }
                      onDismiss={() =>
                        setShowDropDown({ ...showDropDown, extra3Type: false })
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
                  name="extra3Type"
                />

                <HelperText type="error" visible={!!errors.extra3Type}>
                  {errors?.extra3Type?.message}
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
                      label={i18n.t("extra3")}
                      keyboardType="numeric"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      error={errors.extra3}
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

          <View>
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

          <Button
            mode="contained"
            onPress={handleSubmit(handleNext)}
            style={commonStyles.mv10}
          >
            {i18n.t("next")}
          </Button>
          <Button
            mode="outlined"
            onPress={() => navigation.goBack()}
            style={commonStyles.mb60}
          >
            {i18n.t("back")}
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container1: {
    flex: 1,
    flexDirection: "row",
    gap: 10,
  },
});
