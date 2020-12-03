//
//  colors.swift
//  Judorange-webinspector
//
//  Created by Julien Cuénot on 16/07/2019.
//  Copyright © 2019 Julien Cuénot. All rights reserved.
//

import Foundation
import UIKit


// COLORS : GENERIC
var colorGrey240 = UIColor( red: CGFloat(240/255.0), green: CGFloat(240/255.0), blue: CGFloat(240/255.0), alpha: CGFloat(1.0) )
var colorGrey230 = UIColor( red: CGFloat(230/255.0), green: CGFloat(230/255.0), blue: CGFloat(230/255.0), alpha: CGFloat(1.0) )
var colorGrey210 = UIColor( red: CGFloat(210/255.0), green: CGFloat(210/255.0), blue: CGFloat(210/255.0), alpha: CGFloat(1.0) )
var colorGrey190 = UIColor( red: CGFloat(190/255.0), green: CGFloat(190/255.0), blue: CGFloat(190/255.0), alpha: CGFloat(1.0) )
var colorGrey110 = UIColor( red: CGFloat(110/255.0), green: CGFloat(110/255.0), blue: CGFloat(110/255.0), alpha: CGFloat(1.0) )
var colorGrey90 = UIColor( red: CGFloat(110/255.0), green: CGFloat(110/255.0), blue: CGFloat(110/255.0), alpha: CGFloat(1.0) )
var colorGrey35 = UIColor( red: CGFloat(35/255.0), green: CGFloat(35/255.0), blue: CGFloat(35/255.0), alpha: CGFloat(1.0) )
var colorWhite = UIColor( red: CGFloat(255/255.0), green: CGFloat(255/255.0), blue: CGFloat(255/255.0), alpha: CGFloat(1.0) )
var colorOrange = UIColor( red: CGFloat(225/255.0), green: CGFloat(142/255.0), blue: CGFloat(103/255.0), alpha: CGFloat(1.0) )
var colorGreen = UIColor( red: CGFloat(144/255.0), green: CGFloat(184/255.0), blue: CGFloat(0/255.0), alpha: CGFloat(1.0) )
var colorTransparent = UIColor( red: CGFloat(255/255.0), green: CGFloat(255/255.0), blue: CGFloat(255/255.0), alpha: CGFloat(0) )


// COLORS : DEFINE ELEMENTS COLORS
// tabs
var colorTabSelected = colorGrey230
var colorTabNotSelected = colorTabSelected.withAlphaComponent(0.75)
// buttons
var colorBtnMore = colorGreen
var colorBtnClose = UIColor( red: CGFloat(222/255.0), green: CGFloat(88/255.0), blue: CGFloat(51/255.0), alpha: CGFloat(1.0) )
// navbar
var colorNavBar = colorTabSelected
// search field
var colorSearchField = colorTabSelected
