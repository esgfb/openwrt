include $(TOPDIR)/rules.mk

PKG_NAME:=luci-app-tormanager
LUCI_TITLE:=Tormanager LuCI interface
PKG_VERSION:=1.2
PKG_RELEASE:=

PKG_CONFIG_DEPENDS:= \
	CONFIG_PACKAGE_$(PKG_NAME)_INCLUDE_basic \
	CONFIG_PACKAGE_$(PKG_NAME)_INCLUDE_full \
	CONFIG_PACKAGE_$(PKG_NAME)_INCLUDE_tor-hs \
	CONFIG_PACKAGE_$(PKG_NAME)_INCLUDE_tor-gencert \
	CONFIG_PACKAGE_$(PKG_NAME)_INCLUDE_tor-resolve \
	CONFIG_PACKAGE_$(PKG_NAME)_INCLUDE_tor-geoip \
	CONFIG_PACKAGE_$(PKG_NAME)_INCLUDE_torsocks

LUCI_PKGARCH:=all
# LUCI_DEPENDS:= \
	+PACKAGE_$(PKG_NAME)_INCLUDE_basic:tor-basic \
	+PACKAGE_$(PKG_NAME)_INCLUDE_full:tor

define Package/$(PKG_NAME)/config
if PACKAGE_$(PKG_NAME)
menu "Configuration"
	comment "Tor Type Selection"
	choice
		prompt "Select Tor Type"
		default PACKAGE_$(PKG_NAME)_INCLUDE_basic

		config PACKAGE_$(PKG_NAME)_INCLUDE_basic
			bool "Tor basic version"
			select -PACKAGE_tor
			select PACKAGE_tor-basic

		config PACKAGE_$(PKG_NAME)_INCLUDE_full
			bool "Tor full version"
			select -PACKAGE_tor-basic
			select PACKAGE_tor

	endchoice

	config PACKAGE_$(PKG_NAME)_INCLUDE_tor-gencert
			bool "Include Tor Gencert Util"
			select PACKAGE_tor-gencert
			depends on PACKAGE_$(PKG_NAME)_INCLUDE_full=y
			default y

	config PACKAGE_$(PKG_NAME)_INCLUDE_tor-hs
			bool "Include Tor Hidden Service"
			select PACKAGE_tor-hs
			depends on PACKAGE_$(PKG_NAME)_INCLUDE_full=y
			default n

	config PACKAGE_$(PKG_NAME)_INCLUDE_tor-resolve
			bool "Include tor resolve support"
			select PACKAGE_tor-resolve
			depends on (PACKAGE_$(PKG_NAME)_INCLUDE_basic=y || PACKAGE_$(PKG_NAME)_INCLUDE_full=y)
			default y

	config PACKAGE_$(PKG_NAME)_INCLUDE_tor-geoip
			bool "Include tor geoip support"
			select PACKAGE_tor-geoip
			depends on (PACKAGE_$(PKG_NAME)_INCLUDE_basic=y || PACKAGE_$(PKG_NAME)_INCLUDE_full=y)
			default y

	config PACKAGE_$(PKG_NAME)_INCLUDE_torsocks
			bool "Include TorSocks support"
			select PACKAGE_torsocks
			depends on PACKAGE_$(PKG_NAME)_INCLUDE_full=y
			default n

endmenu
endif
endef

include $(TOPDIR)/feeds/luci/luci.mk

# call BuildPackage - OpenWrt buildroot signature
